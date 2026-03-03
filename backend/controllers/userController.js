const db = require('../db');

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, mobile, street, city, postCode, state, country } = req.body;

    const hashedPassword = password; // TODO: Implement proper password hashing

    if (!firstName || !lastName || !email || !password || !mobile || !street || !city || !postCode || !state || !country) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [userResult] = await conn.query(
            'INSERT INTO users (first_name, last_name, email, password_hash, mobile, date_joined, last_login) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [firstName, lastName, email, hashedPassword, mobile]
        );

        const userId = userResult.insertId;

        const [addressResult] = await conn.query(
            'INSERT INTO addresses (user_id, street, city, post_code, state, country) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, street, city, postCode, state, country]
        );

        const addressId = addressResult.insertId;

        await conn.query('UPDATE users SET billing_address_id = ? WHERE user_id = ?', [addressId, userId]);

        await conn.commit();

        res.status(201).json({ message: 'User registered successfully!', userId: userId });
    } catch (err) {
        await conn.rollback();
        console.error('Error registering user:', err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Error registering user' });
    } finally {
        conn.release();
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }

    const hashedPassword = password; // TODO: Implement proper password hashing and comparison

    const conn = await db.getConnection();

    try {
        const [rows] = await conn.query('SELECT first_name, last_name, password_hash FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email does not exist.' });
        }

        const user = rows[0];

        if (user.password_hash !== hashedPassword) {
            return res.status(401).json({ message: 'Password is not correct.' });
        }

        await conn.query('UPDATE users SET last_login = NOW() WHERE email = ?', [email]);
        await conn.commit();

        res.status(200).json({ message: `Login successful! Welcome back ${user.first_name} ${user.last_name}`, user: user });

    } catch (err) {
        await conn.rollback();
        console.error('Error logging in user:', err);
        res.status(500).json({ message: 'Error logging in user' });
    } finally {
        conn.release();
    }
};

// used by users to view their own order history
const getMyOrderHistory = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }

    const hashedPassword = password; // TODO: Implement proper password hashing and comparison

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [rows] = await conn.query('SELECT user_id, password_hash FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email does not exist.' });
        }

        const user = rows[0];

        if (user.password_hash !== hashedPassword) {
            return res.status(401).json({ message: 'Password is not correct.' });
        }

        const [orders] = await conn.query('SELECT o.*, r.* FROM orders o LEFT JOIN order_rows r ON o.order_id = r.order_id WHERE o.user_id = ?', [user.user_id]);

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
    registerUser,
    loginUser,
    getMyOrderHistory
};