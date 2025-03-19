const { supabase } = require('../config/db');

// 🔹 Создание заказа
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // Получаем товары из корзины
        const { data: cartItems, error: cartError } = await supabase
            .from('cart')
            .select('product_id, quantity')
            .eq('user_id', userId);

        if (cartError || !cartItems.length) {
            return res.status(400).json({ message: 'Корзина пуста' });
        }

        // Получаем цены товаров
        const productIds = cartItems.map(item => item.product_id);
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price')
            .in('id', productIds);

        if (productsError || !products.length) {
            return res.status(400).json({ message: 'Ошибка загрузки товаров' });
        }

        // Пересчитываем сумму заказа
        let calculatedTotal = 0;
        cartItems.forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            if (product) calculatedTotal += product.price * item.quantity;
        });

        // Создаём заказ
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: userId,
                total_price: calculatedTotal,
                payment_method: req.body.paymentMethod || "Не указан",
                shipping_address: req.body.shippingAddress || "Не указан",
                status: 'новый',
                payment_status: 'pending'
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // Добавляем товары в `order_items`
        const orderItemsData = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity
        }));

        const { error: orderItemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (orderItemsError) {
            console.error("Ошибка добавления товаров в заказ:", orderItemsError);
            return res.status(500).json({ message: "Ошибка добавления товаров в заказ", error: orderItemsError.message });
        }

        // Очищаем корзину
        await supabase.from('cart').delete().eq('user_id', userId);

        // ✅ Получаем заказ вместе с товарами
        const { data: fullOrder, error: fullOrderError } = await supabase
            .from('orders')
            .select('*, order_items(*)') // <-- исправлено!
            .eq('id', order.id)
            .single();

        if (fullOrderError) throw fullOrderError;

        res.status(201).json({ message: 'Заказ успешно создан', order: fullOrder });
    } catch (error) {
        console.error('❌ Ошибка при создании заказа:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// 🔹 Получение деталей заказа
const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // ✅ Получаем заказ вместе с товарами
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, order_items(*)') // <-- исправлено!
            .eq('id', id)
            .single();

        if (orderError || !order) return res.status(404).json({ message: 'Заказ не найден' });

        // Проверяем, что заказ принадлежит пользователю или он админ
        if (order.user_id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Нет доступа к заказу' });
        }

        return res.json({ order });
    } catch (error) {
        console.error('❌ Ошибка при получении заказа:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// 🔹 Получение всех заказов пользователя
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*, order_items(*)') // <-- исправлено!
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

        // Проверяем, оплачен ли заказ
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('payment_status')
            .eq('id', id)
            .single();

        if (orderError || !order) return res.status(404).json({ message: 'Заказ не найден' });

        if (order.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Заказ ещё не оплачен!' });
        }

        // Обновляем статус заказа
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

module.exports = { createOrder, getUserOrders, updateOrderStatus, getOrderDetails };
