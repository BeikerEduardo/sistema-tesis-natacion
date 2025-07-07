const express = require('express');
const { 
  getAthletes, 
  getAthlete, 
  createAthlete, 
  updateAthlete, 
  deleteAthlete 
} = require('../controllers/athletes.controller');
const {
  getAthleteExternalFactors,
  createAthleteExternalFactor
} = require('../controllers/externalFactors.controller');
const { getRecentAthletes } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const path = require('path');

// Filter for image files only
/*const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};*/

const router = express.Router();

// Validation rules
const athleteValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('dateOfBirth').isDate().withMessage('Date of birth is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('height').isFloat({ min: 1 }).withMessage('Height must be a positive number'),
  body('weight').isFloat({ min: 1 }).withMessage('Weight must be a positive number'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').optional().isEmail().withMessage('Please include a valid email')
];

// Routes
router.route('/')
  .get(protect, getAthletes)
  .post(protect, athleteValidation, createAthlete);

// Get recent athletes for dashboard
router.route('/recent')
  .get(protect, getRecentAthletes);

router.route('/:id')
  .get(protect, getAthlete)
  .put(protect, athleteValidation, updateAthlete)
  .delete(protect, deleteAthlete);

// Rutas para factores externos de atletas
router.route('/:athleteId/external-factors')
  .get(protect, getAthleteExternalFactors)
  .post(protect, createAthleteExternalFactor);

module.exports = router;
