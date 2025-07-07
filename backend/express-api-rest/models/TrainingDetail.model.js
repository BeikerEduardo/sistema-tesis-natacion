const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const TrainingDetail = sequelize.define('TrainingDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Reference to the main training session
  trainingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Trainings',
      key: 'id'
    }
  },
  // Swim test details
  distance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Distance in meters'
  },
  swimStyle: {
    type: DataTypes.ENUM('freestyle', 'backstroke', 'breaststroke', 'butterfly', 'medley'),
    allowNull: false
  },
  timeSeconds: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Time in seconds'
  },
  // Series and repetitions
  seriesNumber: {
    type: DataTypes.INTEGER,
    comment: 'Series number'
  },
  repetitionNumber: {
    type: DataTypes.INTEGER,
    comment: 'Repetition number within the series'
  },
  restIntervalSeconds: {
    type: DataTypes.INTEGER,
    comment: 'Rest interval in seconds'
  },
  strokeCount: {
    type: DataTypes.INTEGER,
    comment: 'Number of strokes per pool length'
  },
  // Additional metrics
  efficiency: {
    type: DataTypes.FLOAT,
    comment: 'Calculated efficiency metric'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Notes specific to this test/distance'
  }
}, {
  timestamps: true
});

module.exports = TrainingDetail;
