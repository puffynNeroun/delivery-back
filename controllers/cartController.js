const { supabase } = require('../config/db');

// 🔹 Получение корзины пользователя
const getCart = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Не авторизован' });

        const { data: cartItems, error } = await supabase
            .from('cart')
            .select('id, product_id, quantity')
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json({ items: cartItems || [] });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении корзины', error: error.message });
    }
};

// 🔹 Добавление товара в корзину
const addToCart = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Не авторизован' });

        const { product_id, quantity } = req.body;
        if (!product_id || quantity <= 0) {
            return res.status(400).json({ message: 'Неверные данные' });
        }

        // ✅ Проверяем, есть ли уже этот товар в корзине
        const { data: existingItem, error: checkError } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('product_id', product_id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        if (existingItem) {
            const { error: updateError } = await supabase
                .from('cart')
                .update({ quantity: existingItem.quantity + quantity })
                .eq('id', existingItem.id);

            if (updateError) throw updateError;
        } else {
            const { error: insertError } = await supabase
                .from('cart')
                .insert([{ user_id: req.user.id, product_id, quantity }]);

            if (insertError) throw insertError;
        }

        res.json({ message: 'Товар добавлен в корзину' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении в корзину', error: error.message });
    }
};

// 🔹 Удаление товара из корзины
const removeFromCart = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Не авторизован' });

        const { product_id } = req.body;
        if (!product_id) return res.status(400).json({ message: 'product_id обязателен' });

        const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', req.user.id)
            .eq('product_id', product_id)
            .select('*');

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        res.json({ message: 'Товар удалён из корзины', deletedItem: data });
    } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        res.status(500).json({ message: 'Ошибка при удалении товара', error: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart };
