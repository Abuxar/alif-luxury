import express from 'express';
import Currency from '../models/Currency.js';
import axios from 'axios';

const router = express.Router();

const FETCH_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Backup rates in case API fails
const FALLBACK_RATES = {
    PKR: 1,
    USD: 0.0036,
    EUR: 0.0033,
    GBP: 0.0028,
    AED: 0.013,
};

// GET /api/currency/rates
router.get('/rates', async (req, res) => {
  try {
    let currencyData = await Currency.findOne({ base: 'PKR' });

    // If no data or data is older than 12 hours, fetch new rates
    if (!currencyData || (Date.now() - new Date(currencyData.lastUpdated).getTime() > FETCH_INTERVAL_MS)) {
        try {
            // Using a free, no-key required exchange rate API for demonstration
            // https://open.er-api.com/v6/latest/PKR
            const response = await axios.get('https://open.er-api.com/v6/latest/PKR');
            if (response.data && response.data.rates) {
                const newRates = {
                    PKR: 1,
                    USD: response.data.rates.USD,
                    EUR: response.data.rates.EUR,
                    GBP: response.data.rates.GBP,
                    AED: response.data.rates.AED
                };

                if (currencyData) {
                    currencyData.rates = newRates;
                    currencyData.lastUpdated = new Date();
                    await currencyData.save();
                } else {
                    currencyData = await Currency.create({
                        base: 'PKR',
                        rates: newRates,
                        lastUpdated: new Date()
                    });
                }
            } else {
                throw new Error("Invalid response from exchange API");
            }
        } catch (fetchError) {
            console.error("Error fetching live exchange rates, falling back to database or defaults:", fetchError.message);
            if (!currencyData) {
                 // Create fallback entry if absolutely nothing is in DB
                 currencyData = await Currency.create({
                    base: 'PKR',
                    rates: FALLBACK_RATES,
                    lastUpdated: new Date()
                });
            }
        }
    }

    res.json(currencyData.rates);
  } catch (error) {
    console.error('Error serving currency rates:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
