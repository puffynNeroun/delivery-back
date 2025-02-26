const { supabase } = require('../config/db');

// 🔹 Регистрация пользователя
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const normalizedEmail = email.toLowerCase();

        // 🔹 Проверяем, существует ли пользователь (попытка входа без реального входа)
        const { data: existingUser, error: loginError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: 'fakePassword123' // Любой фейковый пароль
        });

        if (existingUser?.user) {
            return res.status(400).json({ message: 'Пользователь с таким email уже зарегистрирован' });
        }

        // 🔹 Создаём пользователя в Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password
        });

        if (error || !data?.user) {
            console.error('Ошибка регистрации в Supabase:', error);
            return res.status(400).json({ message: 'Ошибка регистрации', error: error?.message });
        }

        console.log('✅ Пользователь зарегистрирован в Supabase:', data.user.id);

        res.status(201).json({
            message: 'Регистрация успешна',
            user: {
                id: data.user.id,
                email: data.user.email
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};


// 🔹 Вход пользователя
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data?.user) {
            return res.status(401).json({ message: 'Неверные email или пароль' });
        }

        const userId = data.user.id;
        const userEmail = data.user.email;

        // 🔹 Устанавливаем токен в cookie
        res.cookie('token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 час
        });

        res.json({
            message: 'Вход успешен',
            user: {
                id: userId,
                email: userEmail
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// 🔹 Выход пользователя
const logoutUser = async (req, res) => {
    try {
        await supabase.auth.signOut();
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('token', '');
        res.json({ message: 'Выход выполнен' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser };
