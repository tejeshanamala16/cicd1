const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const conn = await pool.getConnection();
    
    // Check if user exists
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    
    if (existing.length > 0) {
      conn.release();
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await conn.query('INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)', 
      [username, email, hashedPassword, full_name || username]);

    conn.release();

    const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      userId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const conn = await pool.getConnection();
    const [users] = await conn.query('SELECT id, password FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      conn.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      conn.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    conn.release();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful',
      token,
      userId: user.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
