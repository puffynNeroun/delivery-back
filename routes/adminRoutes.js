const express = require('express');
const { getUsers, createProduct } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.post('/create-product', protect, admin, createProduct);

module.exports = router;
