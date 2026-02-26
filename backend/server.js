require('dotenv').config();
const express = require('express');
const db = require('./db');
const promisePool = require('./db');

const app = express();
const PORT = process.env.PORT;

console.log(process.env.DB_PASSWORD); // Debugging line to check if DB_HOST is loaded

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello to you from the backend!' });
});

app.get('/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json({ message: 'Products retrieved successfully!', data: rows });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [row] = await db.query('SELECT * FROM products WHERE product_id = ?', [productId]);
        if (row.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product retrieved successfully!', data: row[0] });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

app.post('/create-order', async (req, res) => {
    const { customerId, addressId, paymentMethodId, totalSum, totalWeight, orderRows } = req.body;

    console.log('Received order data:', req.body); // Debugging line to check incoming data

    try {
        const [result] = await db.query(
            'INSERT INTO orders (customer_id, address_id, payment_method_id, order_date, total_sum, total_weight) VALUES (?, ?, ?, NOW(), ?, ?)',
            [customerId, addressId, paymentMethodId, totalSum, totalWeight]
        );
        res.json({ message: 'Order created successfully!', orderId: result.insertId, customerId: customerId });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Error creating order' });
    }

    /*  orderRows.forEach(row => {
            try
        });
    */
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
