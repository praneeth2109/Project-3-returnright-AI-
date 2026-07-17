const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/login
 * Log in the admin user, returns JWT token.
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      admin: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
}

/**
 * POST /api/auth/register (Protected by auth middleware)
 * Registers a new administrator user.
 */
async function register(req, res) {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const existing = await Admin.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Username is already taken.' });
    }

    const newAdmin = await Admin.create({
      username: username.toLowerCase(),
      password, // Hashed automatically on save by Mongoose hooks
      role: role || 'admin',
    });

    return res.status(201).json({
      message: 'New administrator registered successfully.',
      admin: {
        username: newAdmin.username,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
}

/**
 * GET /api/auth/verify
 * Verifies active token (protected by auth middleware).
 */
async function verify(req, res) {
  return res.json({
    valid: true,
    user: req.user,
  });
}

/**
 * Auto-seeds or updates the admin account based on .env config.
 */
async function seedDefaultAdmin() {
  try {
    const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'adminpass123';

    let admin = await Admin.findOne({ username });
    if (!admin) {
      console.log(`🔑 Creating admin account: "${username}"...`);
      await Admin.create({ username, password, role: 'super-admin' });
      console.log(`✅ Admin account created successfully.`);
    } else {
      let isModified = false;
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        console.log(`🔑 Updating admin password to match .env configuration...`);
        admin.password = password;
        isModified = true;
      }
      if (admin.role !== 'super-admin') {
        console.log(`🔑 Promoting seeded admin account to super-admin role...`);
        admin.role = 'super-admin';
        isModified = true;
      }
      if (isModified) {
        await admin.save();
        console.log(`✅ Admin account updated successfully.`);
      }
    }
  } catch (err) {
    console.error('❌ Failed to seed/sync admin user:', err.message);
  }
}

module.exports = { login, register, verify, seedDefaultAdmin };
