const { ExternalFactor, Athlete, Training } = require('../models');
const { validationResult } = require('express-validator');
const ExternalFactorsService = require('../services/externalFactors.service');

/**
 * @desc    Get all external factors
 * @route   GET /api/external-factors
 * @access  Private
 */
exports.getExternalFactors = async (req, res, next) => {
  try {
    const externalFactors = await ExternalFactorsService.getExternalFactors(req.user.id);
    res.status(200).json(externalFactors); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get single external factor
 * @route   GET /api/external-factors/:id
 * @access  Private
 */
exports.getExternalFactor = async (req, res, next) => {
  try {
    const externalFactor = await ExternalFactorsService.getExternalFactor(req.params.id, req.user.id);
    res.status(200).json(externalFactor); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Create new external factor
 * @route   POST /api/external-factors
 * @access  Private
 */
exports.createExternalFactor = async (req, res, next) => {
  try {
    const externalFactor = await ExternalFactorsService.createExternalFactor(req.user.id, req.body);
    res.status(201).json(externalFactor); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Update external factor
 * @route   PUT /api/external-factors/:id
 * @access  Private
 */
exports.updateExternalFactor = async (req, res, next) => {
  try {
    const externalFactor = await ExternalFactorsService.updateExternalFactor(req.params.id, req.user.id, req.body);
    res.status(200).json(externalFactor); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Delete external factor
 * @route   DELETE /api/external-factors/:id
 * @access  Private
 */
exports.deleteExternalFactor = async (req, res, next) => {
  try {
    const externalFactor = await ExternalFactorsService.deleteExternalFactor(req.params.id, req.user.id);
    res.status(200).json(externalFactor); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get external factors for a specific athlete
 * @route   GET /api/athletes/:athleteId/external-factors
 * @access  Private
 */
exports.getAthleteExternalFactors = async (req, res, next) => {
  try {
    const externalFactors = await ExternalFactorsService.getAthleteExternalFactors(req.params.athleteId, req.user.id);
    res.status(200).json(externalFactors); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Create external factor for a specific athlete
 * @route   POST /api/athletes/:athleteId/external-factors
 * @access  Private
 */
exports.createAthleteExternalFactor = async (req, res, next) => {
  try {
    const externalFactor = await ExternalFactorsService.createAthleteExternalFactor(
      req.params.athleteId, 
      req.user.id, 
      req.body
    );
    res.status(201).json(externalFactor); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get external factors for a specific training
 * @route   GET /api/trainings/:trainingId/external-factors
 * @access  Private
 */
exports.getTrainingExternalFactors = async (req, res, next) => {
  try {
    const externalFactors = await ExternalFactorsService.getTrainingExternalFactors(req.params.trainingId, req.user.id);
    res.status(200).json(externalFactors); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Create external factor for a specific training
 * @route   POST /api/trainings/:trainingId/external-factors
 * @access  Private
 */
exports.createTrainingExternalFactor = async (req, res, next) => {
  try {

    const { trainingId } = req.params;

    const externalFactor = await ExternalFactorsService.createTrainingExternalFactor(
      trainingId, 
      req.user.id, 
      req.body
    );
    res.status(201).json(externalFactor); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
