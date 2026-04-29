require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const policyRoutes = require('./routes/policies');
const queryRoutes = require('./routes/query');
const { seedDatabase } = require('./utils/seeder');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/returnright';
// CORS configuration — dynamically allow any localhost origin
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow any localhost/127.0.0.1 origin on any port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
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
    app.listen(PORT, () => {
      console.log(`🚀 ReturnRight AI server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
