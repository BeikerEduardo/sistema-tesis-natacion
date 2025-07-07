const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Training = sequelize.define('Training', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Basic Session Data
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Title of the training session'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of the training session'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Location where the training takes place'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
    comment: 'Current status of the training session'
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  trainingType: {
    type: DataTypes.ENUM('resistance', 'speed', 'technique', 'mixed', 'other'),
    allowNull: false
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  // Weather conditions (for outdoor training)
  isOutdoor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  temperature: {
    type: DataTypes.FLOAT,
    comment: 'Temperature in Celsius'
  },
  humidity: {
    type: DataTypes.FLOAT,
    comment: 'Humidity percentage'
  },
  weatherCondition: {
    type: DataTypes.ENUM('sunny', 'cloudy', 'rainy', 'other'),
    comment: 'Weather condition during training'
  },
  // Athlete reference
  athleteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Athletes',
      key: 'id'
    }
  },
  // Coach reference
  coachId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // Physiological Data
  heartRateRest: {
    type: DataTypes.INTEGER,
    comment: 'Heart rate at rest (bpm)'
  },
  heartRateDuring: {
    type: DataTypes.INTEGER,
    comment: 'Heart rate during exercise (bpm)'
  },
  heartRateAfter: {
    type: DataTypes.INTEGER,
    comment: 'Heart rate after exercise (bpm)'
  },
  weightBefore: {
    type: DataTypes.FLOAT,
    comment: 'Weight before training (kg)'
  },
  weightAfter: {
    type: DataTypes.FLOAT,
    comment: 'Weight after training (kg)'
  },
  // Performance Factors
  breathingPattern: {
    type: DataTypes.STRING,
    comment: 'Breathing pattern used (e.g., every 2, 3, or more strokes)'
  },
  physicalStateRating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Subjective physical state (scale 1-10)'
  },
  painReported: {
    type: DataTypes.TEXT,
    comment: 'Pain or discomfort reported (body area and intensity)'
  },
  // Equipment Used
  swimsuitType: {
    type: DataTypes.STRING,
    comment: 'Type of swimsuit used (e.g., jammer, compression suit)'
  },
  equipmentUsed: {
    type: DataTypes.TEXT,
    comment: 'Additional tools used (e.g., paddles, fins, pull buoy)'
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes about the training session'
  },
  // Time information
  startTime: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Start time of the training session (HH:MM format)'
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'End time of the training session (HH:MM format)'
  }
}, {
  timestamps: true
});

module.exports = Training;
