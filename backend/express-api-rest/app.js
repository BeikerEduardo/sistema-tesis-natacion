const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:1420', 'http://127.0.0.1:1420', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Import routes
const authRoutes = require('./routes/auth.route');
const athleteRoutes = require('./routes/athletes.route');
const trainingsRoutes = require('./routes/trainings.route');
const analyticsRoutes = require('./routes/analytics.route');
const dashboardRoutes = require('./routes/dashboard.route');
const externalFactorRoutes = require('./routes/externalFactors.route');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/trainings', trainingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/external-factors', externalFactorRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Swimming Training Management API is running');
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;