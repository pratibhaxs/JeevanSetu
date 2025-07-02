const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // change as needed
  password: 'pratibha', // change as needed
  database: 'jeevansetu'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Register endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err2) => {
      if (err2) return res.status(500).json({ message: 'Database error.' });
      res.status(201).json({ message: 'Registration successful.' });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user = results[0];
    res.json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
  });
});

// Save or update health profile (JeevanSetu ID is generated only if not present)
app.post('/api/profile', (req, res) => {
  const { userEmail, fullName, bloodGroup, allergies, conditions, emergencyName, emergencyPhone, medications, doctor, jeevansetuId } = req.body;
  if (!userEmail || !bloodGroup || !emergencyName || !emergencyPhone) {
    return res.status(400).json({ message: 'Required fields missing.' });
  }
  db.query('SELECT id FROM users WHERE email = ?', [userEmail], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'User not found.' });
    const userId = results[0].id;
    // Check if profile exists
    db.query('SELECT * FROM health_profiles WHERE user_id = ?', [userId], (err3, results3) => {
      if (err3) return res.status(500).json({ message: 'Database error.' });
      let finalJeevanSetuId = jeevansetuId;
      if (results3.length > 0) {
        // Profile exists, use existing JeevanSetu ID
        finalJeevanSetuId = results3[0].jeevansetu_id;
      } else if (!jeevansetuId) {
        // Generate new JeevanSetu ID
        finalJeevanSetuId = 'JVS-' + Math.floor(1000 + Math.random() * 9000);
      }
      db.query(
        `INSERT INTO health_profiles (user_id, jeevansetu_id, full_name, blood_group, allergies, conditions, emergency_name, emergency_phone, medications, doctor)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           full_name=VALUES(full_name), blood_group=VALUES(blood_group), allergies=VALUES(allergies), conditions=VALUES(conditions),
           emergency_name=VALUES(emergency_name), emergency_phone=VALUES(emergency_phone),
           medications=VALUES(medications), doctor=VALUES(doctor)`,
        [userId, finalJeevanSetuId, fullName, bloodGroup, allergies, conditions, emergencyName, emergencyPhone, medications, doctor],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Database error.' });
          res.json({ message: 'Profile saved.', jeevansetuId: finalJeevanSetuId });
        }
      );
    });
  });
});

// Get health profile by JeevanSetu ID (for doctor/NGO view)
app.get('/api/profile/by-id/:jeevansetuId', (req, res) => {
  const jeevansetuId = req.params.jeevansetuId;
  if (!jeevansetuId) return res.status(400).json({ message: 'JeevanSetu ID required.' });
  db.query('SELECT * FROM health_profiles WHERE jeevansetu_id = ?', [jeevansetuId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(404).json({ message: 'Profile not found.' });
    res.json(results[0]);
  });
});

// Get health profile by user email
app.get('/api/profile', (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) return res.status(400).json({ message: 'Email required.' });
  db.query('SELECT id FROM users WHERE email = ?', [userEmail], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'User not found.' });
    const userId = results[0].id;
    db.query('SELECT * FROM health_profiles WHERE user_id = ?', [userId], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Database error.' });
      if (results2.length === 0) return res.json(null);
      res.json(results2[0]);
    });
  });
});

// Fallback: serve index.html for any unknown route (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 