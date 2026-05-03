const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const demoPaymentController = require('../controllers/demo-payment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/create-payment-intent', verifyToken, checkoutController.createPaymentIntent);
router.post('/demo-pay', verifyToken, demoPaymentController.processSimulatedPayment);

module.exports = router;
