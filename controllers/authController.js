const { supabase } = require('../config/db');

const registerUser = async (req, res) => {
    try {
        const { email, password, is_admin } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        // Приводим email к нижнему регистру
        const normalizedEmail = email.toLowerCase();

        // Регистрируем пользователя в Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password
        });

        if (error) {
            console.error('Ошибка регистрации в Supabase Auth:', error);
            return res.status(400).json({ message: 'Ошибка регистрации', error: error.message });
        }

        console.log('✅ Пользователь зарегистрирован в Supabase:', data);

        // Сохраняем пользователя в БД
        const { error: dbError } = await supabase
            .from('users')
            .insert([
                {
                    id: data.user.id, // UID, который выдает Supabase
                    email: normalizedEmail,
                    is_admin: is_admin || false
                }
            ]);

        if (dbError) {
            console.error('Ошибка сохранения пользователя в БД:', dbError);
            return res.status(500).json({ message: 'Ошибка сохранения в БД', error: dbError.message });
        }

        res.status(201).json({ message: 'Регистрация успешна', user: data.user });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Аутентификация через Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Ошибка входа:', error);
            return res.status(401).json({ message: 'Неверные email или пароль', error: error.message });
        }

        console.log('✅ Вход успешен:', data.user);

        res.json({
            message: 'Вход успешен',
            token: data.session.access_token, // Supabase сам выдает JWT токен
            user: data.user
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
