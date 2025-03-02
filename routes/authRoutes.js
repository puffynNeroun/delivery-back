const express = require('express');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 🔹 Лимит попыток входа (5 раз за 10 минут)
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 минут
    max: 5,
    message: { message: 'Слишком много попыток входа. Попробуйте позже.' }
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

module.exports = router;
