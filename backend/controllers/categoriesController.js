const db = require('../db');

// QUESTION: Is it professional to name like this? or better to be more specific and name like category/subcategory
const CATEGORY_TYPES = ['main', 'sub'];

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

const createCategory = async (req, res) => {
    const { name, description, category_id } = req.body;
    const tableName = req.params.type === 'main' ? 'categories' : req.params.type === 'sub' ? 'subcategories' : null;

    if (!tableName || !req.params.type) {
        return res.status(400).json({ message: 'Invalid category type' });
    }
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    // (name, description, category_id)
    let query = 'INSERT INTO ' + tableName + ' (name, description' + (tableName === 'subcategories' ? ', category_id' : '') + ') VALUES (?, ?' + (tableName === 'subcategories' ? ', ?' : '') + ')';


    try {
        const [result] = await db.query(query, [name, description, category_id]);
        res.status(201).json({ message: 'Category created successfully!', categoryId: result.insertId });
    } catch (err) {
        console.error('Error creating category:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error creating category' });
    }
};

const updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    try {
        const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE category_id = ?', [name, description, categoryId]);
        if (result.affectedRows === 0) {
            const err = new Error(`Category with ID ${categoryId} not found`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: 'Category updated successfully!' });
    } catch (err) {
        console.error('Error updating category:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error updating category' });
    }
};

const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM categories WHERE category_id = ?', [categoryId]);
        if (result.affectedRows === 0) {
            const err = new Error(`Category with ID ${categoryId} not found`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: 'Category deleted successfully!' });
    } catch (err) {
        console.error('Error deleting category:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error deleting category' });
    }
};


module.exports = {
    getAllCategories,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory
};