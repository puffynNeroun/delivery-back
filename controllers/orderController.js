const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const { orderItems, totalPrice, paymentMethod, shippingAddress } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            totalPrice,
            paymentMethod,
            shippingAddress,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

module.exports = { createOrder, getUserOrders };
