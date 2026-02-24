const express = require('express');
const mysql = require('mysql2');
const env = require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3007;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(express.json());






app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
