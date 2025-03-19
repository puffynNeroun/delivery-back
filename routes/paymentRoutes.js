const express = require('express');
const { processPayment, handlePaymentWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/pay', protect, processPayment); // ✔ Теперь `processPayment` существует
router.post('/webhook', handlePaymentWebhook); // ✔ Обрабатываем уведомления от платежной системы

module.exports = router;
