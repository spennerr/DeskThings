const db = require('../db');

const createOrder = async (req, res) => {
    const { userId, addressId, paymentMethodId, orderRows } = req.body;

    if (!userId || !addressId || !paymentMethodId || !orderRows || !Array.isArray(orderRows) || orderRows.length === 0) {
        return res.status(400).json({ message: 'Missing required fields or orderRows is not a valid array' });
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [orderResult] = await conn.query(
            'INSERT INTO orders (user_id, address_id, payment_method_id, order_date, total_sum, total_weight) VALUES (?, ?, ?, NOW(), 0, 0)',
            [userId, addressId, paymentMethodId]
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

            totalSum += price * row.quantity;
            totalWeight += weightKg * row.quantity;

            await conn.query(
                'INSERT INTO order_rows (order_id, product_id, quantity, unit_price, unit_weight_kg) VALUES (?, ?, ?, ?, ?)',
                [orderId, row.productId, row.quantity, price, weightKg]
            );

            await conn.query('UPDATE products SET stock_qty = stock_qty - ? WHERE product_id = ?', [row.quantity, row.productId]);
        }

        await conn.query('UPDATE orders SET total_sum = ?, total_weight = ? WHERE order_id = ?', [totalSum, totalWeight, orderId]);

        await conn.commit();

        res.json({ message: 'Order and all its rows created successfully!', orderId: orderId, userId: userId, totalSum: totalSum, totalWeight: totalWeight });

    } catch (err) {
        console.error('Error creating order:', err);
        await conn.rollback();
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message || 'Error creating order' });

    } finally {
        conn.release();
    }
};

const getOrderHistory = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [orders] = await conn.query('SELECT o.*, r.* FROM orders o LEFT JOIN order_rows r ON o.order_id = r.order_id');

        const orderMap = new Map();

        for (const row of orders) {
            if (!orderMap.has(row.order_id)) {
                orderMap.set(row.order_id, {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    address_id: row.address_id,
                    payment_method_id: row.payment_method_id,
                    order_date: row.order_date,
                    total_sum: row.total_sum,
                    total_weight: row.total_weight,
                    orderRows: [],
                });
            }

            if (row.order_row_id != null) {
                orderMap.get(row.order_id).orderRows.push({
                    order_row_id: row.order_row_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    unit_price: row.unit_price,
                    unit_weight_kg: row.unit_weight_kg,
                });
            }
        }
        await conn.commit();

        res.json({
            message: "Order history with rows retrieved successfully!",
            data: [...orderMap.values()], // QUESTION: Why the dot dot dot!! This is the spread operator, it converts the values of the Map into an array.
        });
    }
    catch (err) {
        console.error('Error fetching order history:', err);
        await conn.rollback();
        res.status(500).json({ message: 'Error fetching order history' });
    } finally {
        conn.release();
    }
};

const getOrderHistoryByUserId = async (req, res) => {
    const userId = req.params.id;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();


        const [orders] = await conn.query('SELECT o.*, r.* FROM orders o LEFT JOIN order_rows r ON o.order_id = r.order_id WHERE o.user_id = ?', [userId]);

        const orderMap = new Map();

        for (const row of orders) {
            if (!orderMap.has(row.order_id)) {
                orderMap.set(row.order_id, {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    address_id: row.address_id,
                    payment_method_id: row.payment_method_id,
                    order_date: row.order_date,
                    total_sum: row.total_sum,
                    total_weight: row.total_weight,
                    orderRows: [],
                });
            }

            if (row.order_row_id != null) {
                orderMap.get(row.order_id).orderRows.push({
                    order_row_id: row.order_row_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    unit_price: row.unit_price,
                    unit_weight_kg: row.unit_weight_kg,
                });
            }
        }
        await conn.commit();

        res.json({
            message: "Order history with rows retrieved successfully!",
            data: [...orderMap.values()], // QUESTION: Why the dot dot dot!! This is the spread operator, it converts the values of the Map into an array.
        });
    }
    catch (err) {
        console.error('Error fetching order history:', err);
        await conn.rollback();
        res.status(500).json({ message: 'Error fetching order history' });
    } finally {
        conn.release();
    }
};

module.exports = {
    createOrder,
    getOrderHistory,
    getOrderHistoryByUserId
};