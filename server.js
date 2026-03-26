const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Put your HTML/CSS files in a 'public' folder

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Your MySQL username
    password: '',      // Your MySQL password
    database: 'logic-lab-db'
});

db.connect(err => {
    if (err) throw err;
    console.log("Database Connected!");
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    // Removed 'async' since we are no longer awaiting bcrypt
    db.execute(query, [email], (err, results) => {
        if (err) return res.status(500).send("Server Error");
        
        if (results.length > 0) {
            const user = results[0];
            
            // Direct string comparison instead of bcrypt.compare
            if (password === user.password) {
                // Success! Redirect to overview
                res.redirect('/overview.html');
            } else {
                res.send("Invalid Password!");
            }
        } else {
            res.send("User not found!");
        }
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));