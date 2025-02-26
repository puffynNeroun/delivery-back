const { supabase } = require('../config/db');

const protect = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    try {
        const { data: userData, error } = await supabase.auth.getUser(token);

        if (error || !userData?.user) {
            return res.status(401).json({ message: 'Неверный или истекший токен' });
        }

        req.user = {
            id: userData.user.id,
            email: userData.user.email
        };

        console.log("✅ Пользователь авторизован:", req.user);
        next();
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};




const admin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Доступ запрещен, требуется роль администратора' });
    }
    next();
};

module.exports = { protect, admin };
