require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

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
    const { customerId, addressId, paymentMethodId, orderRows } = req.body;

    if (!customerId || !addressId || !paymentMethodId || !orderRows || !Array.isArray(orderRows) || orderRows.length === 0) {
        return res.status(400).json({ message: 'Missing required fields or orderRows is not a valid array' });
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [orderResult] = await conn.query(
            'INSERT INTO orders (customer_id, address_id, payment_method_id, order_date, total_sum, total_weight) VALUES (?, ?, ?, NOW(), 0, 0)',
            [customerId, addressId, paymentMethodId]
        );

        const orderId = orderResult.insertId;

        let totalSum = 0;
        let totalWeight = 0;

        for (const row of orderRows) {

            const { productId, quantity } = row;
            if (!productId || !quantity || quantity <= 0) {
                const err = new Error('Missing productId or quantity in order row');
                err.statusCode = 400;
                throw err;
            }

            const [productRow] = await conn.query('SELECT base_price, weight_kg FROM products WHERE product_id = ?', [productId]);
            if (productRow.length === 0) {
                const err = new Error(`Product with ID ${row.productId} not found`);
                err.statusCode = 404;
                throw err;
            }

            const price = productRow[0].base_price;
            const weightKg = productRow[0].weight_kg;

            console.log(`Processing order row: productId=${productId}, quantity=${quantity}, price=${price}, weightKg=${weightKg}`);

            totalSum += price * row.quantity;
            totalWeight += weightKg * row.quantity;

            await conn.query(
                'INSERT INTO order_rows (order_id, product_id, quantity, unit_price, unit_weight_kg) VALUES (?, ?, ?, ?, ?)',
                [orderId, row.productId, row.quantity, price, weightKg]
            );
        }

        await conn.query('UPDATE orders SET total_sum = ?, total_weight = ? WHERE order_id = ?', [totalSum, totalWeight, orderId]);

        await conn.commit();

        res.json({ message: 'Order and all its rows created successfully!', orderId: orderId, customerId: customerId, totalSum: totalSum, totalWeight: totalWeight });

    } catch (err) {
        console.error('Error creating order:', err);
        await conn.rollback();
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message || 'Error creating order' });

    } finally {
        conn.release();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
