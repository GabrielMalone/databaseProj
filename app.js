const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const fs = require('fs');

// CORS configuration for all incoming requests
app.use(cors({
    origin: ['https://databaseproj.onrender.com','http://localhost:3000'],  // Replace with your frontend's domain
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // If you're using cookies or credentials
}));


// Handle OPTIONS preflight requests for the API
app.options('/api/query', cors());  // This will allow OPTIONS requests for /api/query
app.options('*', cors()); 
app.use(express.static('public'));
app.use(express.json());

// Read the CA certificate if required (you can specify the file path)
// const caCert = fs.readFileSync('path/to/ca-certificate.pem');  // Adjust with your CA cert path

const db = mysql.createPool({
    host: 'mysql-152fdd39-database205.f.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_Kw4b7pqVvY1n2g_MjVn',
    database: 'defaultdb',
    port: 27024,
    ssl: {
        ca: fs.readFileSync('cert.pem'),  // The CA cert must be correctly specified
        rejectUnauthorized: true,  // Ensure SSL is verified
    }
});

// Test the connection
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
        res.setHeader('Content-Type', 'application/json'); 
        res.json(results);  // Send the query results in a structured object
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
