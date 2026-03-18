// These are overwritten dynamically from the backend API on load.
// eslint-disable-next-line prefer-const
export let EXCHANGE_RATES: Record<string, number> = {
    PKR: 1,
    USD: 0.0036, // 1 PKR = ~0.0036 USD (approx 278 PKR/USD)
    EUR: 0.0033,
    GBP: 0.0028,
    AED: 0.013,
};

export const fetchLiveRates = async (setRatesLoaded?: () => void) => {
    try {
        const res = await fetch('http://localhost:3000/api/currency/rates');
        if (res.ok) {
            const data = await res.json();
            if (data && data.PKR) {
                Object.assign(EXCHANGE_RATES, data);
            }
        }
    } catch(e) {
        console.error("Failed to load live exchange rates. Falling back to static rates.", e);
    } finally {
        if (setRatesLoaded) setRatesLoaded();
    }
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
    PKR: 'Rs. ',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
};

export const formatPrice = (priceInPKR: number, currency: string = 'PKR'): string => {
    if (!priceInPKR && priceInPKR !== 0) return '';
    
    const rate = EXCHANGE_RATES[currency] || 1;
    const symbol = CURRENCY_SYMBOLS[currency] || 'Rs. ';
    
    const converted = priceInPKR * rate;
    
    // Formatting: no decimals for PKR, 2 decimals for others
    if (currency === 'PKR') {
        return `${symbol}${Math.round(converted).toLocaleString()}`;
    } else {
        return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
};
