const { supabase } = require('../config/db');

// 🔹 Создание заказа
const createOrder = async (req, res) => {
    try {
        const { orderItems, totalPrice, paymentMethod, shippingAddress } = req.body;
        const userId = req.user.id;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Корзина пуста' });
        }

        // 🔹 Добавляем заказ
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: userId,
                total_price: totalPrice,
                payment_method: paymentMethod,
                shipping_address: shippingAddress,
                status: 'новый'
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 🔹 Добавляем товары в `order_items`
        const orderItemsData = orderItems.map(item => ({ order_id: order.id, product_id: item.product_id, quantity: item.quantity }));
        await supabase.from('order_items').insert(orderItemsData);

        // 🔹 Очищаем корзину после заказа
        await supabase.from('cart').delete().eq('user_id', userId);

        res.status(201).json({ message: 'Заказ создан', order });
    } catch (error) {
        console.error('❌ Ошибка при создании заказа:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// 🔹 Получение заказов пользователя
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// 🔹 Обновление статуса заказа (только админ)
const updateOrderStatus = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }

        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Статус заказа обновлён', order: data });
    } catch (error) {
        console.error('❌ Ошибка при обновлении статуса заказа:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

module.exports = { createOrder, getUserOrders, updateOrderStatus };
