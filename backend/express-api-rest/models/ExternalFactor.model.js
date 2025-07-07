const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const ExternalFactor = sequelize.define('ExternalFactor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Reference to athlete
  athleteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Athletes',
      key: 'id'
    }
  },
  // Reference to training (optional - can be general or specific to a training)
  trainingId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Trainings',
      key: 'id'
    }
  },
  // Factor type
  factorType: {
    type: DataTypes.ENUM('injury', 'fatigue', 'nutrition', 'sleep', 'stress', 'medication', 'other'),
    allowNull: false
  },
  // Description
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Severity (if applicable)
  severity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Severity on scale 1-10 (if applicable)'
  },
  // Date range
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    comment: 'End date (null if ongoing)'
  },
  // Impact on performance (subjective)
  performanceImpact: {
    type: DataTypes.INTEGER,
    validate: {
      min: -10,
      max: 10
    },
    comment: 'Impact on performance from -10 (very negative) to +10 (very positive)'
  },
  // Notes
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = ExternalFactor;
