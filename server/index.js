require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const policyRoutes = require('./routes/policies');
const queryRoutes = require('./routes/query');
const authRoutes = require('./routes/auth');
const { seedDatabase } = require('./utils/seeder');
const { migrateEmbeddings } = require('./utils/embedMigrator');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/returnright';

const allowedOrigins = [];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // If not in production, allow all origins for easy development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    const isAllowed = 
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin) ||
      origin.endsWith('.netlify.app');

    if (isAllowed) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/policies', policyRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    // Seed the database with sample policies on first run
    await seedDatabase();
    
    // Bootstrap default super-admin account if no admins exist
    const Admin = require('./models/Admin');
    const { hashPassword } = require('./utils/auth');
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const defaultAdmin = new Admin({
          username: 'admin',
          password: hashPassword('admin'),
          role: 'super-admin'
        });
        await defaultAdmin.save();
        console.log('🛡️ Bootstrapped default Super Admin (admin/admin)');
      }
    } catch (bootstrapErr) {
      console.error('❌ Default admin bootstrap failed:', bootstrapErr.message);
    }

    // Run embeddings migration to populate vector data
    await migrateEmbeddings();

    app.listen(PORT, () => {
      console.log(`🚀 ReturnRight AI server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
