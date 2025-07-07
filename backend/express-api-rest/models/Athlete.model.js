const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Athlete = sequelize.define('Athlete', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString().split('T')[0] // Fecha debe ser anterior a hoy
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Height in centimeters'
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Weight in kilograms'
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  coachId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Athlete;
