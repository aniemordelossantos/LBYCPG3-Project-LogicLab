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
                res.send("<script>alert('Invalid Password!'); window.location.href='/login.html';</script>");
            }
        } else {
            res.send("<script>alert('User Not Found!'); window.location.href='/login.html';</script>");
        }
    });
});

// Sign Up / Request Access Route
app.post('/signup', (req, res) => {
    const { FullName, email, password } = req.body;

    // SQL query to insert new user into the database
    const query = "INSERT INTO users (FullName, email, password) VALUES (?, ?, ?)";
    
    db.execute(query, [FullName, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error creating account. Email might already exist.");
        }
        
        // After successful insertion, send them back to login
        res.send("<script>alert('Account Created Successfully!'); window.location.href='/login.html';</script>");
    });
});



app.listen(3000, () => console.log("Server running on http://localhost:3000"));