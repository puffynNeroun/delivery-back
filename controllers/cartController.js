const Cart = require('../models/Cart');

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex >= 0) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart' });
    }
};

module.exports = { getCart, addToCart, removeFromCart };
