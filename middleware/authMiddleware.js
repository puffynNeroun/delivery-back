const { supabase } = require('../config/db');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // ✅ Проверяем токен через Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ message: 'Неверный или истекший токен' });
        }

        req.user = { id: user.id, email: user.email };
        next();
    } catch (error) {
        console.error('❌ Ошибка авторизации:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// Middleware для проверки админа
const admin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Доступ запрещен, требуется роль администратора' });
    }
    next();
};

module.exports = { protect, admin };
