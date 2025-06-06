const express = require('express');
const { createCheckoutSession, handleStripeWebhook } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router; 