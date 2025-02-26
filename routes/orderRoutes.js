const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/admin', protect, admin, getUserOrders);

module.exports = router;
