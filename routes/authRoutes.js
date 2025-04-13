const express = require('express');
const {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
    getMe
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { message: 'Слишком много попыток входа. Попробуйте позже.' }
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

// 👇 новый маршрут
router.get('/me', protect, getMe);

module.exports = router;
