const { Training, TrainingDetail, Athlete, ExternalFactor } = require('../models');
const { sequelize } = require('../database/config');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const TrainingsService = require('../services/trainings.service');

// @desc    Get all trainings (with optional filtering)
// @route   GET /api/trainings
// @access  Private
exports.getTrainings = async (req, res, next) => {
  try {
    // Extraer parámetros de consulta
    const { athleteId, startDate, endDate, trainingType, page = 1, limit = 10, sort = 'date', order = 'desc' } = req.query;
    
    // Pasar todos los parámetros necesarios
    const trainings = await TrainingsService.getTrainings({
      coachId: req.user.id,
      athleteId,
      startDate,
      endDate,
      trainingType,
      page,
      limit,
      sort,
      order
    });
    
    res.status(200).json(trainings); // El servicio ya devuelve el objeto con formato correcto
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single training with details
// @route   GET /api/trainings/:id
// @access  Private
exports.getTraining = async (req, res, next) => {
  try {
    const training = await TrainingsService.getTraining(req.params.id, req.user.id);
    res.status(200).json(training);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new training with details
// @route   POST /api/trainings
// @access  Private
exports.createTraining = async (req, res, next) => {
  try {
    // Añadir el ID del entrenador al cuerpo de la solicitud
    const trainingData = {
      ...req.body,
      coachId: req.user.id
    };
    
    const training = await TrainingsService.createTraining(trainingData);
    res.status(201).json(training);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update training
// @route   PUT /api/trainings/:id
// @access  Private
exports.updateTraining = async (req, res, next) => {
  try {
    
    const training = await TrainingsService.updateTraining(req.params.id, req.body);
    res.status(200).json(training);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete training
// @route   DELETE /api/trainings/:id
// @access  Private
// @desc    Update training status
// @route   PUT /api/trainings/:id/status
// @access  Private
exports.updateTrainingStatus = async (req, res, next) => {
  try {
    const training = await TrainingsService.updateTrainingStatus(
      req.params.id, 
      req.user.id, 
      req.body.status
    );
    res.status(200).json({ success: true, data: training });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete training
// @route   DELETE /api/trainings/:id
// @access  Private
exports.deleteTraining = async (req, res, next) => {
  try {
    const training = await TrainingsService.deleteTraining(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: training });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
