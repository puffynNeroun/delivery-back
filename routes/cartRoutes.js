const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController'); // Обновлены имена функций
const { protect } = require('../middleware/authMiddleware');

// Добавление продукта в корзину
router.post('/add', protect, addToCart);

// Получение корзины
router.get('/', protect, getCart);

// Удаление продукта из корзины
router.post('/remove', protect, removeFromCart);

module.exports = router;
