const Product = require('../models/Product');
const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = new Product({ name, description, price, category, stock });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
};

module.exports = { getUsers, createProduct };
