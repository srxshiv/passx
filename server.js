const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'new_password', 
    database: 'passx'
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Create database if not exists
db.query('CREATE DATABASE IF NOT EXISTS passx', (err, result) => {
    if (err) throw err;
    console.log("Database created");
});

// Create table if not exists
const createTableQuery = `CREATE TABLE IF NOT EXISTS passwords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    website VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255)
)`;
db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log("Table created");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Get all passwords
app.get('/passwords', (req, res) => {
    const sql = 'SELECT * FROM passwords';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Add a password
app.post('/submit', (req, res) => {
    const { website, username, password } = req.body;
    const sql = 'INSERT INTO passwords (website, username, password) VALUES (?, ?, ?)';
    db.query(sql, [website, username, password], (err, result) => {
        if (err) throw err;
        res.json({ message: "Password Saved" });
    });
});

// Delete a password
app.post('/delete', (req, res) => {
    const { website } = req.body;
    const sql = 'DELETE FROM passwords WHERE website = ?';
    db.query(sql, [website], (err, result) => {
        if (err) throw err;
        res.json({ message: `Successfully deleted ${website}'s password` });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
