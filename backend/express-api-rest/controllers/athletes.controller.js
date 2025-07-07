const { Athlete } = require('../models');
const { validationResult } = require('express-validator');
const AthleteService = require('../services/athletes.service');

// @desc    Get all athletes for a coach
// @route   GET /api/athletes
// @access  Private
exports.getAthletes = async (req, res, next) => {
  try {
    const athletes = await AthleteService.getAthletes(req.user.id);
    res.status(200).json({ success: true, count: athletes.length, data: athletes });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single athlete
// @route   GET /api/athletes/:id
// @access  Private
exports.getAthlete = async (req, res, next) => {
  try {
    const athlete = await AthleteService.getAthlete(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: athlete });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new athlete
// @route   POST /api/athletes
// @access  Private
exports.createAthlete = async (req, res, next) => {
  try {
    const athlete = await AthleteService.createAthlete(req.user.id, req.body);
    res.status(201).json({ success: true, data: athlete });
  } catch (err) {
    next(err);
  }
};

// @desc    Update athlete
// @route   PUT /api/athletes/:id
// @access  Private
exports.updateAthlete = async (req, res, next) => {
  try {
    const athlete = await AthleteService.updateAthlete(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: athlete });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete athlete
// @route   DELETE /api/athletes/:id
// @access  Private
exports.deleteAthlete = async (req, res, next) => {
  try {
    const athlete = await AthleteService.deleteAthlete(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: athlete });
  } catch (err) {
    next(err);
  }
};
