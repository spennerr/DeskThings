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



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
