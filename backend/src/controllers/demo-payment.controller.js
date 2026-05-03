const db = require('../config/db');

exports.processSimulatedPayment = async (req, res, next) => {
    try {
        const { order_id, card_data } = req.body;
        
        // Simulamos un delay de red para realismo (2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Validamos que la orden exista
        const orderRes = await db.query('SELECT status FROM orders WHERE id = $1', [order_id]);
        if (orderRes.rows.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });

        // Actualizamos a completado (simulando éxito)
        await db.query(
            "UPDATE orders SET status = 'completado', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
            [order_id]
        );

        res.json({ 
            success: true, 
            message: 'Pago procesado con éxito (MODO DEMO)',
            transaction_id: `DEMO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
    } catch (error) {
        next(error);
    }
};
