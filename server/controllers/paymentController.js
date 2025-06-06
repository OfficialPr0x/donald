const { stripe } = require('../services/stripeService');
const { supabase } = require('../services/supabaseService');

async function createCheckoutSession(req, res, next) {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) return res.status(400).json({ error: 'userId and email required' });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }],
      success_url: process.env.CLIENT_ORIGIN + '/success',
      cancel_url: process.env.CLIENT_ORIGIN + '/cancel',
      metadata: { userId }
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

async function handleStripeWebhook(req, res, next) {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.userId;
      // Activate user in Supabase
      await supabase.from('profiles').update({ active: true }).eq('id', userId);
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCheckoutSession, handleStripeWebhook }; 