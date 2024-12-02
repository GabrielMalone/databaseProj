// Import the MySQL module
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
// Create a connection pool (better for multiple queries)
const db = mysql.createPool({
    host: 'localhost',      // Database host
    user: 'root',           // Database username
    password: 'Htgopb!23',  // Database password
    database: 'mydb'        // Database name
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
        res.json(results); // Send the query results
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});