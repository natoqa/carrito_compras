const db = require('../config/db');
const { z } = require('zod');

const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    category_id: z.number().int(),
    image_url: z.string().url().optional().or(z.literal('')),
    min_stock_alert: z.number().int().optional()
});

exports.getAll = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE 1=1
        `;
        const params = [];

        if (category && category !== 'All') {
            params.push(category);
            query += ` AND c.name = $${params.length}`;
        }
        if (minPrice) {
            params.push(minPrice);
            query += ` AND p.price >= $${params.length}`;
        }
        if (maxPrice) {
            params.push(maxPrice);
            query += ` AND p.price <= $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            query += ` AND p.name ILIKE $${params.length}`;
        }

        const result = await db.query(query, params);
        console.log(`📦 Se encontraron ${result.rows.length} productos.`);
        res.json(result.rows);
    } catch (error) {
        console.error('❌ ERROR EN GET_ALL_PRODUCTS:', error.message);
        console.error('SQL Query intentada:', error.query || 'N/A');
        next(error);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const result = await db.query(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const data = productSchema.parse(req.body);
        const result = await db.query(
            'INSERT INTO products (name, description, price, stock, category_id, image_url, min_stock_alert) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [data.name, data.description, data.price, data.stock, data.category_id, data.image_url, data.min_stock_alert]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const data = productSchema.parse(req.body);
        const result = await db.query(
            'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category_id=$5, image_url=$6, min_stock_alert=$7, updated_at=CURRENT_TIMESTAMP WHERE id=$8 RETURNING *',
            [data.name, data.description, data.price, data.stock, data.category_id, data.image_url, data.min_stock_alert, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
