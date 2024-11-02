const express = require('express');
const { getAllUsers, deleteUser, getAllOrders } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, admin, getAllUsers);

router.delete('/users/:id', protect, admin, deleteUser);

router.get('/orders', protect, admin, getAllOrders);

module.exports = router;
