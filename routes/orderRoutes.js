const express = require('express');
const { createOrder, getUserOrders, updateOrderStatus, getOrderDetails, getAllOrders} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderDetails);
router.patch('/:id', protect, admin, updateOrderStatus);
router.get('/admin/all', protect, admin, getAllOrders);

module.exports = router;
