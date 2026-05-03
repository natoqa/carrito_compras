const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.get('/dashboard', verifyToken, authorize('Admin', 'Vendedor'), reportController.getDashboardStats);
router.get('/download/sales', verifyToken, authorize('Admin', 'Vendedor'), reportController.downloadSalesReport);

module.exports = router;
