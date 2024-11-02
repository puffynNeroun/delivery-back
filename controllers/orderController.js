const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const { orderItems, totalPrice, paymentMethod } = req.body;
        const order = new Order({
            user: req.user._id,
            orderItems,
            totalPrice,
            paymentMethod,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order' });
    }
};

module.exports = { createOrder };
