const express = require('express');
const { processPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/pay', protect, processPayment);

module.exports = router;
