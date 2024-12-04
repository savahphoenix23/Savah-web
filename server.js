const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files (HTML, CSS, JS)

// Encryption key
const encryptionKey = 'your-secret-key';  // Replace with a secure key

// Mock database (user data)
let users = [];

// Route to handle sign-up
app.post('/signup', (req, res) => {
    const { encryptedEmail, encryptedPassword } = req.body;

    // Decrypt email and password
    const decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, encryptionKey).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey).toString(CryptoJS.enc.Utf8);

    // Check if user already exists
    const existingUser = users.find(u => u.email === decryptedEmail);
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Hash the password
    bcrypt.hash(decryptedPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ success: false, message: 'Error hashing password' });

        // Store the new user
        const newUser = { email: decryptedEmail, password: hashedPassword, twoFactorEnabled: true };
        users.push(newUser);

        res.status(200).json({ success: true, message: 'Sign-up successful!' });
    });
});

// Route to handle login
app.post('/login', (req, res) => {
    const { encryptedEmail, encryptedPassword } = req.body;

    // Decrypt email and password
    const decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, encryptionKey).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey).toString(CryptoJS.enc.Utf8);

    // Find user in the database
    const user = users.find(u => u.email === decryptedEmail);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    // Check password hash
    bcrypt.compare(decryptedPassword, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ success: false, message: 'Error comparing passwords' });
        if (isMatch) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
});