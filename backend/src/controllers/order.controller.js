const db = require('../config/db');
const { z } = require('zod');

const orderItemSchema = z.object({
    product_id: z.number().int(),
    quantity: z.number().int().positive()
});

const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1),
    coupon_code: z.string().optional()
});

exports.create = async (req, res, next) => {
    const client = await db.pool.connect();
    try {
        const { items, coupon_code } = createOrderSchema.parse(req.body);
        const customer_id = req.user.id;

        await client.query('BEGIN');

        let total_amount = 0;
        let discount_amount = 0;
        let coupon_id = null;
        const outOfStockItems = [];

        // 1. Validar Stock y bloquear filas
        for (const item of items) {
            const prodRes = await client.query(
                'SELECT id, name, price, stock FROM products WHERE id = $1 FOR UPDATE', 
                [item.product_id]
            );

            if (prodRes.rows.length === 0) {
                throw new Error(`Producto ID ${item.product_id} no existe.`);
            }

            const product = prodRes.rows[0];
            if (product.stock < item.quantity) {
                outOfStockItems.push(`${product.name} (Disponible: ${product.stock})`);
            }
        }

        if (outOfStockItems.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                message: 'Stock insuficiente para algunos productos', 
                details: outOfStockItems 
            });
        }

        // 2. Validar cupón
        if (coupon_code) {
            const couponRes = await client.query(
                'SELECT * FROM coupons WHERE code = $1 AND is_active = TRUE AND expires_at > CURRENT_TIMESTAMP',
                [coupon_code]
            );
            if (couponRes.rows.length > 0) {
                const coupon = couponRes.rows[0];
                coupon_id = coupon.id;
            }
        }

        // 3. Crear Orden
        const orderRes = await client.query(
            'INSERT INTO orders (customer_id, status) VALUES ($1, $2) RETURNING id',
            [customer_id, 'pendiente']
        );
        const order_id = orderRes.rows[0].id;

        // 4. Procesar Items y descontar stock
        for (const item of items) {
            const prodRes = await client.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
            const price = prodRes.rows[0].price;

            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2', 
                [item.quantity, item.product_id]
            );

            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
                [order_id, item.product_id, item.quantity, price]
            );

            total_amount += Number(price) * item.quantity;
        }

        // 5. Aplicar descuento
        if (coupon_id) {
            const couponRes = await client.query('SELECT discount_percentage FROM coupons WHERE id = $1', [coupon_id]);
            discount_amount = (total_amount * couponRes.rows[0].discount_percentage) / 100;
        }

        const final_amount = total_amount - discount_amount;
        await client.query(
            'UPDATE orders SET total_amount = $1, discount_amount = $2, coupon_id = $3 WHERE id = $4',
            [final_amount, discount_amount, coupon_id, order_id]
        );

        await client.query('COMMIT');
        res.status(201).json({ order_id, total: final_amount });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        
        let query = `
            SELECT o.*, u.username as customer_name 
            FROM orders o 
            JOIN users u ON o.customer_id = u.id 
        `;
        const params = [];

        if (role === 'Cliente') {
            params.push(userId);
            query += ` WHERE o.customer_id = $1`;
        }

        query += ` ORDER BY o.created_at DESC`;

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const orderRes = await db.query(`
            SELECT o.*, u.username as customer_name, u.email as customer_email,
                   c.code as coupon_code, c.discount_percentage
            FROM orders o 
            JOIN users u ON o.customer_id = u.id
            LEFT JOIN coupons c ON o.coupon_id = c.id
            WHERE o.id = $1
        `, [orderId]);
        
        if (orderRes.rows.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });

        const itemsRes = await db.query(`
            SELECT oi.*, p.name, p.image_url 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = $1
        `, [orderId]);

        res.json({
            ...orderRes.rows[0],
            items: itemsRes.rows
        });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const result = await db.query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};
