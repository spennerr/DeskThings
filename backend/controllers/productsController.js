const db = require('../db');

const getAllProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json({ message: 'Products retrieved successfully!', data: rows });
    } catch (err) {
        console.error('Error fetching products:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error fetching products' });
    }
};

const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const [row] = await db.query('SELECT * FROM products WHERE product_id = ?', [productId]);
        if (row.length === 0) {
            const err = new Error(`Product with ID ${productId} not found`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: 'Product retrieved successfully!', data: row[0] });
    } catch (err) {
        console.error('Error fetching product:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error fetching product' });
    }
};

const getProductsByCategory = async (req, res) => {
    const categoryName = req.params.category;
    try {
        const [rows] = await db.query(
            'SELECT p.* FROM products p JOIN subcategories s ON p.subcategory_id = s.subcategory_id JOIN categories c ON s.category_id = c.category_id WHERE c.name = ?',
            [categoryName]
        );
        if (rows.length === 0) {
            const err = new Error(`No products found in category: ${categoryName}`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: 'Products retrieved successfully!', data: rows });
    } catch (err) {
        console.error('Error fetching products by category:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error fetching products by category' });
    }
}

const getProductsBySubcategory = async (req, res) => {
    const categoryName = req.params.category;
    const subcategoryName = req.params.subcategory;
    try {
        const [rows] = await db.query(
            'SELECT p.* FROM products p JOIN subcategories s ON p.subcategory_id = s.subcategory_id JOIN categories c ON s.category_id = c.category_id WHERE c.name = ? AND s.name = ?',
            [categoryName, subcategoryName]
        );
        if (rows.length === 0) {
            const err = new Error(`No products found in subcategory: ${subcategoryName} of category: ${categoryName}`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: 'Products retrieved successfully!', data: rows });
    } catch (err) {
        console.error('Error fetching products by subcategory:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error fetching products by subcategory' });
    }
};

const searchProducts = async (req, res) => {
    const searchQuery = req.query.q;
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE name LIKE ?', [`%${searchQuery}%`]);
        if (rows.length === 0) {
            const err = new Error(`No products found searching for: ${searchQuery}`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: 'Search results retrieved successfully!', data: rows });
    } catch (err) {
        console.error('Error performing search:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error performing search' });
    }
};

const createProduct = async (req, res) => {
    const { name, description, basePrice, salePrice, weightKg, subcategoryId, brandId, onSale, stockQuantity, imageUrl } = req.body;

    if (!name || !basePrice || !description || !onSale || !stockQuantity) {
        return res.status(400).json({ message: 'Name, description, base price, on sale status, and stock quantity are required fields' });
    }

    conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.query(
            'INSERT INTO products (name, description, base_price, sale_price, weight_kg, subcategory_id, brand_id, on_sale, stock_qty, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, basePrice, salePrice, weightKg, subcategoryId, brandId, onSale, stockQuantity, imageUrl]
        );
        await conn.commit();
        res.status(201).json({ message: 'Product created successfully!', data: { productId: result.insertId } });
    } catch (err) {
        await conn.rollback();
        console.error('Error creating product:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error creating product' });
    } finally {
        conn.release();
    }
};

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, description, basePrice, salePrice, weightKg, subcategoryId, brandId, onSale, stockQuantity, imageUrl } = req.body;

    if (!name || !basePrice || !description || !onSale || !stockQuantity) {
        return res.status(400).json({ message: 'Name, description, base price, on sale status, and stock quantity are required fields' });
    }

    try {
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, base_price = ?, sale_price = ?, weight_kg = ?, subcategory_id = ?, brand_id = ?, on_sale = ?, stock_qty = ?, img_url = ? WHERE product_id = ?',
            [name, description, basePrice, salePrice, weightKg, subcategoryId, brandId, onSale, stockQuantity, imageUrl, req.params.id]
        );
        if (result.affectedRows === 0) {
            // QUESTION: Should we throw error to catch or immediately return 404 response here?
            const err = new Error(`Product with ID ${req.params.id} not found`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: `Product with ID ${productId} updated successfully!` });
    } catch (err) {
        console.error('Error updating product:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error updating product' });
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
        if (result.affectedRows === 0) {
            const err = new Error(`Product with ID ${productId} not found`);
            err.statusCode = 404;
            throw err;
        }
        res.json({ message: `Product with ID ${productId} deleted successfully!` });
    } catch (err) {
        console.error('Error deleting product:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error deleting product' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    searchProducts,
    getProductsByCategory,
    getProductsBySubcategory,
    createProduct,
    updateProduct,
    deleteProduct
};