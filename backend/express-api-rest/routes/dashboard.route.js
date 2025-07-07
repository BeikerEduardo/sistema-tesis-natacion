const express = require('express');
const { getDashboardStats, getBasicMetrics } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Routes
router.route('/stats').get(protect, getDashboardStats);
router.route('/metrics').get(protect, getBasicMetrics);

module.exports = router;
