// Import the MySQL module
const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');

// Use CORS middleware
app.use(cors({
    origin: ['*'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type'
}));

app.options('*', cors());

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
// Read the CA certificate if required (you can specify the file path)
const caCert = `MIIEQTCCAqmgAwIBAgIUdIwTz+w6PVlwqwYIk6aUItwVxq4wDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMDY5ZmI0MDUtZGJiOC00MzQ4LWE0MDAtYTE0MDg3OTkz
Zjk2IFByb2plY3QgQ0EwHhcNMjQxMjAyMjMyMTU2WhcNMzQxMTMwMjMyMTU2WjA6
MTgwNgYDVQQDDC8wNjlmYjQwNS1kYmI4LTQzNDgtYTQwMC1hMTQwODc5OTNmOTYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAL+ePcaL
awm8v9LY7O5cehjBlzX7pZFJxgdy2pU8sXfZp1TzcfRGoCEq/ZoRKj7/UR/hxxAF
YOQV8gaQ3yJfkLiI4qrd9zKBZ5i0GI1pW/Vfb5qjuzDjnzPRA06oYC6H8x+vV23p
buberjQvAQmFLSejAQ6ovqwo3a60j66GsDlGz0Jac0UCkSrfuTyzBs4Dtq2pLoyv
jl9ZNqowOhTafGZA2QDFCbrzOE8B6SmtHjOrQnx5KIj8Ilp9+jIcc+RlE384x62b
3GJLHUZ8o0fouJQjRzwKlWmLL20xzX9LBhkXvCm4f1u2nDJlJ6lf337NmeN3DrWa
Y/o6GUY1c204lxqP+9K3v+MPy7quU2lraJ0qX0t2Y5La5UlXSkU2DxQLdJmRodp6
1TsoSXIhyMx8R6Pn5l22xNsk9pf190cfpPsxX5Dm5czuyQvue1J+K+cvHcXhPOnK
jFT+vojXpo/QD1nZOWPY7iIXkcsy59ghaJG1pi2ZQKAbNEpG9ugLxwAHIQIDAQAB
oz8wPTAdBgNVHQ4EFgQUH+M+y275lGhhqMJZIxeFOBfx+kgwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAJljoTN7NUtEi3Gd
7Yrj6K8gyP+T9ECa5nxQiFO6tAR5+/Pf7bnPS2n8nRLvrvWmwauIq0sVU5sRvtYT
n3OGQrXqx1zKfWOvuZ3Z2S3mXsqtGwCBU7hbHyrvuBU2FTk7e1JOwJ3zVsSqMnhN
7HbOd1tIg2mowS+2bij9Ucp4Oh/o+4aNt1CfJLbnSotT6k+NTY98bgZO/6VTTF13
O/ewO23LllbJJyEfHHI5GjMbwRhoFP+aVSJPxmM6KJLn2uFKqnrsKQtBxIQF9TVp
ARVfSMR7MKmFol2BvAXk1dcjzN0RTf6MAuTne2q3PGjkE5X82M4IIrhjYPZvYAga
PEorSTjaMf5Q+SnUCAQOmsujp19S/rd74ZKIFOzrwYHEl6hjlmEoKsgG0+m8uU8T
bTRdeiFICaoXFCTjTzNJ4dRi/YhAbYUWk1YWoQ7UCJNfcGrcK/TB3om/b9LuSITj
fksCwqa252SE4oImvtzbSgXADP6PIJWo7dRNV7gx+AfbOgegjw`;  // Adjust with your CA cert path
// Create a connection pool (better for multiple queries)
const db = mysql.createPool({
    host: 'mysql-152fdd39-database205.f.aivencloud.com',   // Database host
    user: 'avnadmin',                                      // Database username
    password: 'AVNS_Kw4b7pqVvY1n2g_MjVn',                  // Database password
    database: 'defaultdb',                                 // Database name
    port: 27024,                                           // Database port
    ssl: {
        ca: caCert,  // Specify the CA certificate for SSL
        rejectUnauthorized: true,  // Ensures SSL verification
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
        res.json({ data: results }); 
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
