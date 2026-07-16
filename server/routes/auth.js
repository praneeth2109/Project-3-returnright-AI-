const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { hashPassword, generateToken, verifyToken } = require('../utils/auth');

/**
 * Helper middleware to restrict register route to authenticated super-admins.
 */
async function requireSuperAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'super-admin') {
      return res.status(403).json({ error: 'Super Admin privileges required.' });
    }

    req.user = payload;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth check failed.' });
  }
}

/**
 * POST /api/auth/register — Onboard a new administrator (requires super-admin).
 */
router.post('/register', requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const newAdmin = new Admin({
      username,
      password: hashPassword(password),
      role: role || 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Administrator registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login — Authenticate admin.
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin || admin.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = generateToken({
      id: admin._id,
      username: admin.username,
      role: admin.role,
    });

    res.json({
      token,
      admin: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/auth/verify — Verify token.
 */
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({ valid: false });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(200).json({ valid: false });
    }

    res.json({
      valid: true,
      user: {
        username: payload.username,
        role: payload.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
