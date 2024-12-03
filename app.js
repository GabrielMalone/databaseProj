const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const app = express();

// CORS configuration for all incoming requests
const corsOptions = {
    origin: ['https://databaseproj.onrender.com', 'http://localhost:3000'], // Specify exact origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow cookies and credentials
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests for /api/query
app.options('/api/query', cors(corsOptions));  // Allow OPTIONS requests for /api/query
// Optionally, you can handle other OPTIONS requests globally (for all routes)
app.options('*', cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Static file serving (if needed)
app.use(express.static('public'));

// MySQL database connection with SSL configuration
const db = mysql.createPool({
    host: 'mysql-152fdd39-database205.f.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_Kw4b7pqVvY1n2g_MjVn',
    database: 'defaultdb',
    port: 27024,
    ssl: {
        ca: Buffer.from(process.env.MYSQL_SSL_CERT, 'utf-8'),
        rejectUnauthorized: true,  // Ensure SSL is verified
    },
});

// Test the database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release(); // Release the connection back to the pool
});

// Dynamic query endpoint
app.post('/api/query', (req, res) => {
    const { query, values } = req.body;
    console.log('Received query:', req.body);  // Log the incoming request data

    // Validate that the query exists
    if (!query) {
        return res.status(400).send('Query not provided.');
    }

    // Execute the query
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).send('Database error');
        }

        // Log headers to check if CORS headers are set
        console.log('Response Headers:', res.getHeaders());

        res.setHeader('Content-Type', 'application/json'); 
        res.json(results);  // Send the query results in a structured object
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
