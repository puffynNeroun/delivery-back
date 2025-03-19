const express = require('express');
const router = express.Router();
const { supabase } = require('../config/db.js');

// 1. Инициация платежа (заглушка, пока нет API СБИС)
const processPayment = async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "orderId обязателен" });

    const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (error || !order) return res.status(404).json({ message: "Заказ не найден" });

    return res.json({
        message: "Платеж инициирован (заглушка)",
        payment_url: "https://example.com/pay",
        orderId,
    });
};

// 2. Обработка вебхука платежной системы (заглушка)
const handlePaymentWebhook = async (req, res) => {
    const { orderId, payment_status } = req.body;
    if (!orderId || !payment_status) return res.status(400).json({ message: "Некорректные данные" });

    const { error } = await supabase.from('orders').update({ payment_status }).eq('id', orderId);
    if (error) return res.status(500).json({ message: "Ошибка обновления заказа" });

    return res.json({ message: "Статус заказа обновлен" });
};

module.exports = { processPayment, handlePaymentWebhook };
