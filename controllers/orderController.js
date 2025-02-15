const { supabase } = require('../config/db');

// Создание заказа
const createOrder = async (req, res) => {
    try {
        const { orderItems, totalPrice, paymentMethod, shippingAddress } = req.body;

        console.log(req.body)

        console.log("📝 Тело запроса (req.body):", req.body);
        console.log("🛠 Проверка orderItems:", req.body.orderItems);


        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        console.log("✅ Пользователь авторизован:", req.user); // Проверяем пользователя
        console.log("🔍 Данные перед вставкой:", {
            user_id: req.user.id, // Должен совпадать с auth.uid()
            order_items: orderItems,
            total_price: totalPrice,
            payment_method: paymentMethod,
            shipping_address: shippingAddress
        });

        // Попробуем сначала SELECT, чтобы проверить RLS
        const { data: checkUser, error: checkError } = await supabase.auth.getUser(req.headers.authorization.split(' ')[1]);
        console.log("🔍 Проверка Supabase auth:", checkUser, checkError);


        // Вставка заказа
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                user_id: req.user.id, // Должен совпадать с auth.uid()
                order_items: orderItems,
                total_price: totalPrice,
                payment_method: paymentMethod,
                shipping_address: shippingAddress
            }])
            .select();

        if (error) throw error;

        res.status(201).json({ message: 'Order created successfully', order: data });
    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Получение заказов пользователя
const getUserOrders = async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', req.user.id);

        if (error) {
            throw error;
        }

        res.json(orders);
    } catch (error) {
        console.error('❌ Ошибка получения заказов:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

module.exports = { createOrder, getUserOrders };
