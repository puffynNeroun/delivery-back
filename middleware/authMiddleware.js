const { supabase } = require('../config/db');

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ message: 'Неверный токен' });
        }

        req.user = { id: data.user.id, email: data.user.email }; // Вызов ошибки
        console.log("✅ Пользователь авторизован:", req.user); // Логируем

        next();
    } catch (error) {
        console.error('Ошибка валидации токена:', error);
        res.status(401).json({ message: 'Ошибка авторизации' });
    }
};


const admin = (req, res, next) => {
    if (req.user && req.user.user_metadata?.is_admin) {
        next();
    } else {
        res.status(403).json({ message: 'Доступ запрещен' });
    }
};

module.exports = { protect, admin };
