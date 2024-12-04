const CryptoJS = require('crypto-js'); // CryptoJS library for encryption

const encryptionKey = 'your-secret-key';  // Replace with a secure key

// Show Sign-Up Form
function showSignUpForm() {
    document.getElementById('signup-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
}

// Show Login Form
function showLoginForm() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('signup-section').style.display = 'none';
}

// Sign-Up Form Submission
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Encrypt the email and password
    const encryptedEmail = CryptoJS.AES.encrypt(email, encryptionKey).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();

    // Send the encrypted email and password to the backend
    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedEmail, encryptedPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Sign-up successful! You can now log in.');
            showLoginForm();
        } else {
            alert('Sign-up failed: ' + data.message);
        }
    });
});

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Encrypting the email and password
    const encryptedEmail = CryptoJS.AES.encrypt(email, encryptionKey).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();

    loginUser(encryptedEmail, encryptedPassword);
});

function loginUser(encryptedEmail, encryptedPassword) {
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedEmail, encryptedPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login Successful!');
            document.getElementById('2fa-section').style.display = 'block'; // Show 2FA section
        } else {
            alert('Invalid credentials');
        }
    });
}

function verify2FACode() {
    const code = document.getElementById('2fa-code').value;
    if (code === '123456') { // Fake 2FA code for testing
        alert('2FA verified');
    } else {
        alert('Invalid 2FA code');
    }
}