import Stripe from 'stripe';
import Product from '../models/Product.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret', {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req, res) => {
  try {
    const { items, email } = req.body;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'pkr',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100, // Stripe expects amounts in cents/paisa
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?canceled=true`,
      metadata: {
         // Pass cart items to webhook for stock decrement
         cartItems: JSON.stringify(items.map(i => ({ id: i.id, quantity: i.quantity })))
      }
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({ error: 'Checkout session creation failed.' });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Note: In Vercel serverless, req.body is already parsed as string/buffer if configured correctly in raw middleware
    // For simplicity in this Express app, assuming we have the raw body available
    event = stripe.webhooks.constructEvent(
        req.rawBody || req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_secret'
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Fulfill the order
    try {
        if (session.metadata && session.metadata.cartItems) {
            const cartItems = JSON.parse(session.metadata.cartItems);
            
            // Deduct stock
            for (const item of cartItems) {
                const product = await Product.findById(item.id);
                if (product) {
                    product.inventoryCount = Math.max(0, (product.inventoryCount || 0) - item.quantity);
                    await product.save();
                }
            }
            console.log(`Order fulfilled successfully for session: ${session.id}`);
        }
    } catch (err) {
        console.error('Error fulfilling order:', err);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
