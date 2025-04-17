const { supabase } = require('../config/db');
// Получение всех продуктов
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        let query = supabase.from('products').select('*');

        if (category && category !== 'Все') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};


// Добавление продукта (только админ)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'Изображение обязательно' });
        }

        const { data, error } = await supabase
            .from('products')
            .insert([{ name, description, price, category, image }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// Обновление продукта (только админ)
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const { id } = req.params;

        const { data, error } = await supabase
            .from('products')
            .update({ name, description, price, category, image })
            .eq('id', id)
            .select();

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// Удаление продукта (только админ)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            throw error;
        }

        res.json({ message: 'Продукт удалён' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const getPopularProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products') // название твоей таблицы
            .select('*');

        if (error) throw new Error(error.message);

        // Возвращаем случайные 4
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);

        res.json(selected);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения популярных товаров', error: error.message });
    }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, getPopularProducts };