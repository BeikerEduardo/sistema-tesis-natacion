const { User } = require('../models');
const { validationResult } = require('express-validator');
const AuthService = require('../services/auth.service');

// @desc    Register a new coach
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    const user = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    const user = await AuthService.login(req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await AuthService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
