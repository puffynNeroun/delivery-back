// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({ name, email, password });
        await user.save();
        const token = user.generateAuthToken();
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Вход пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        const token = user.generateAuthToken();
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;
