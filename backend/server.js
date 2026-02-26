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

    let orderId = null; // Placeholder for order ID to be generated after inserting the order

    try {
        const [orderResult] = await db.query(
            'INSERT INTO orders (customer_id, address_id, payment_method_id, order_date, total_sum, total_weight) VALUES (?, ?, ?, NOW(), ?, ?)',
            [customerId, addressId, paymentMethodId, totalSum, totalWeight]
        );
        orderId = orderResult.insertId; // Get the generated order ID
        console.log('Order created successfully! Order ID:', orderId);
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Error creating order' });
    }

    orderRows.forEach(async row => {
        try {
            const [productRow] = await db.query('SELECT base_price, weight_kg FROM products WHERE product_id = ?', [row.productId]);
            if (productRow.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            row.price = productRow[0].base_price;
            row.weightKg = productRow[0].weight_kg;
        } catch (err) {
            console.error('Error fetching product for order row:', err);
            return res.status(500).json({ message: 'Error fetching product for order row' });
        }

        try {
            const [rowResult] = await db.query(
                'INSERT INTO order_rows (order_id, product_id, quantity, unit_price, unit_weight_kg) VALUES (?, ?, ?, ?, ?)',
                [orderId, row.productId, row.quantity, row.price, row.weightKg]
            );
            console.log('Order row created successfully! Row ID:', rowResult.insertId);
        } catch (err) {
            console.error('Error creating order row:', err);
            return res.status(500).json({ message: 'Error creating order row' });
        }
    });
    res.json({ message: 'Order and all its rows created successfully!', orderId: orderId, customerId: customerId });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
