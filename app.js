const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Server port configuration
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: ['https://databaseproj.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static('public'));

// MySQL connection pool configuration
const db = mysql.createPool({
    host: 'mysql-152fdd39-database205.f.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_Kw4b7pqVvY1n2g_MjVn',
    database: 'defaultdb',
    port: 27024,
    ssl: {
        ca: fs.readFileSync('cert.pem'),
        rejectUnauthorized: true, // Enforce SSL verification
    },
});

// Test MySQL connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release(); // Release connection back to the pool
});

// Preflight handling for CORS
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204); // No content
});

// API endpoint to handle dynamic queries
app.post('/api/query', (req, res) => {
    const { query, values } = req.body;

    // Input validation
    if (!query) {
        return res.status(400).json({ error: 'Query not provided.' });
    }

    console.log('Executing query:', query, values); // Debugging log

    // Execute the query
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error.' });
        }

        // Send query results
        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
