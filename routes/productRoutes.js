const express = require('express');
const { createProduct, getProducts, updateProduct, deleteProduct, getPopularProducts} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, admin, createProduct);
router.get('/', getProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.get('/popular', getPopularProducts);


module.exports = router;
