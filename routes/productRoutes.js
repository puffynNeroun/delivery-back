const express = require('express');
const { getProducts, createProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, admin, createProduct);

module.exports = router;
