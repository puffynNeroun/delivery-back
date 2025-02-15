const jwt = require('jsonwebtoken');
const { supabase } = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Получаем пользователя из Supabase
            const { data: user, error } = await supabase
                .from('users')
                .select('id, email, is_admin')
                .eq('id', decoded.id)
                .single();

            if (!user || error) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user; // Сохраняем пользователя в req
            next();
        } catch (error) {
            console.error('Ошибка валидации токена:', error);
            res.status(401).json({ message: 'Token invalid, authorization failed' });
        }
    } else {
        res.status(401).json({ message: 'No token, authorization denied' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

module.exports = { protect, admin };
