const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/db');

const registerUser = async (req, res) => {
    try {
        const { email, password, is_admin } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        // Проверяем, существует ли уже пользователь
        const { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'Такой пользователь уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Добавляем пользователя в Supabase
        const { data, error: insertError } = await supabase
            .from('users')
            .insert([{ email, password: hashedPassword, is_admin: is_admin || false }])
            .select();

        if (insertError) {
            throw insertError;
        }

        res.status(201).json({ message: 'Регистрация успешна', user: data });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Получаем пользователя из Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(401).json({ message: 'Неверные email или пароль' });
        }

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Неверные email или пароль' });
        }

        // Генерируем токен
        const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '30d' });


        res.json({ message: 'Вход успешен', token, user });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
