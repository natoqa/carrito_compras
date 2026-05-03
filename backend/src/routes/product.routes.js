const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');
const db = require('../config/db');

router.get('/categories', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
});

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Solo Admin y Vendedor pueden modificar el catálogo
router.post('/', verifyToken, authorize('Admin', 'Vendedor'), productController.create);
router.put('/:id', verifyToken, authorize('Admin', 'Vendedor'), productController.update);
router.delete('/:id', verifyToken, authorize('Admin', 'Vendedor'), productController.delete);

module.exports = router;
