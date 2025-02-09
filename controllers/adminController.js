const User = require('../models/User');

// Получение всех пользователей (только для админов)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Не передаем пароли
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Удаление пользователя (только для админов)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        await user.deleteOne();
        res.json({ message: 'Пользователь удалён' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = { getUsers, deleteUser };
