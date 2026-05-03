const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const db = require('../config/db');

exports.createPaymentIntent = async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(503).json({ 
                message: 'El servicio de Stripe no está configurado. Use el Modo Demo para pruebas.' 
            });
        }
        const { order_id } = req.body;
        
        const orderRes = await db.query('SELECT total_amount FROM orders WHERE id = $1', [order_id]);
        if (orderRes.rows.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });
        
        const amount = Math.round(Number(orderRes.rows[0].total_amount) * 100); // Stripe usa centavos

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: { order_id: order_id.toString() }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        next(error);
    }
};

exports.webhook = async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(503).send('Webhook service not configured');
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.order_id;

        await db.query(
            "UPDATE orders SET status = 'completado', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
            [orderId]
        );
        console.log(`Payment successful for Order ${orderId}`);
    }

    res.json({ received: true });
};
