const db = require('../db');

const getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json({ message: 'Categories retrieved successfully!', data: rows });
    } catch (err) {
        console.error('Error fetching categories:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error fetching categories' });
    }
};

const getCategoryByName = async (req, res) => {
    const categoryName = req.params.name;
    try {
        const [row] = await db.query('SELECT * FROM categories WHERE name = ?', [categoryName]);
        if (row.length === 0) {
            const err = new Error(`Category with name ${categoryName} not found`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: 'Category retrieved successfully!', data: row[0] });
    } catch (err) {
        console.error('Error fetching category:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error fetching category' });
    }
};

module.exports = {
    getAllCategories,
    getCategoryByName
};