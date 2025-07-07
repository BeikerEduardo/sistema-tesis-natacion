const express = require('express');
const { 
  getExternalFactors, 
  getExternalFactor, 
  createExternalFactor,
  getAthleteExternalFactors,
  getTrainingExternalFactors,
  createTrainingExternalFactor,
  deleteExternalFactor,
  updateExternalFactor
} = require('../controllers/externalFactors.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Rutas para factores externos generales

router.get('/', protect, getExternalFactors);

router.get('/:id', protect, getExternalFactor);

router.post('/', protect, createExternalFactor);

router.post('/:id', protect, createTrainingExternalFactor);

router.put('/:id', protect, updateExternalFactor);

router.delete('/:id', protect, deleteExternalFactor);

module.exports = router;
