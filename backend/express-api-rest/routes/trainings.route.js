const express = require('express');
const { 
  getTrainings, 
  getTraining, 
  createTraining, 
  updateTraining, 
  deleteTraining,
  updateTrainingStatus
} = require('../controllers/trainings.controller');
const {
  getTrainingExternalFactors,
  createTrainingExternalFactor
} = require('../controllers/externalFactors.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Routes

// Obtener Entrenamientos (todos)
router.get('/', protect, getTrainings);

// Crear Entrenamiento
router.post('/', protect, createTraining);

// Obtener Entrenamiento por ID
router.get('/:id', protect, getTraining);

// Actualizar Entrenamiento
router.put('/:id', protect, updateTraining);

// Eliminar Entrenamiento
router.delete('/:id', protect, deleteTraining);

// Actualizar Estado de Entrenamiento
router.patch('/:id/status', protect, updateTrainingStatus);

// Obtener Factores Externos de Entrenamiento
router.get('/:trainingId/external-factors', protect, getTrainingExternalFactors);

// Crear Factor Externo de Entrenamiento
router.post('/:trainingId/external-factors', protect, createTrainingExternalFactor);

module.exports = router;
