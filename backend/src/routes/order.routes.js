const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/', orderController.create);
router.get('/', orderController.getHistory);
router.get('/:id', orderController.getDetails);
router.patch('/:id/status', authorize('Admin', 'Vendedor'), orderController.updateStatus);

module.exports = router;
