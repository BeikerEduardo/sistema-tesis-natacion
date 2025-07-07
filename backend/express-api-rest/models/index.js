const User = require('./User.model');
const Athlete = require('./Athlete.model');
const Training = require('./Training.model');
const TrainingDetail = require('./TrainingDetail.model');
const ExternalFactor = require('./ExternalFactor.model');

// Define relationships

// User (Coach) to Athletes (One-to-Many)
User.hasMany(Athlete, { foreignKey: 'coachId', as: 'athletes' });
Athlete.belongsTo(User, { foreignKey: 'coachId', as: 'coach' });

// User (Coach) to Trainings (One-to-Many)
User.hasMany(Training, { foreignKey: 'coachId', as: 'trainings' });
Training.belongsTo(User, { foreignKey: 'coachId', as: 'coach' });

// Athlete to Trainings (One-to-Many)
Athlete.hasMany(Training, { foreignKey: 'athleteId', as: 'trainings' });
Training.belongsTo(Athlete, { foreignKey: 'athleteId', as: 'athlete' });

// Training to TrainingDetails (One-to-Many)
Training.hasMany(TrainingDetail, { foreignKey: 'trainingId', as: 'details' });
TrainingDetail.belongsTo(Training, { foreignKey: 'trainingId', as: 'training' });

// Athlete to ExternalFactors (One-to-Many)
Athlete.hasMany(ExternalFactor, { foreignKey: 'athleteId', as: 'externalFactors' });
ExternalFactor.belongsTo(Athlete, { foreignKey: 'athleteId', as: 'athlete' });

// Training to ExternalFactors (One-to-Many, Optional)
Training.hasMany(ExternalFactor, { foreignKey: 'trainingId', as: 'externalFactors' });
ExternalFactor.belongsTo(Training, { foreignKey: 'trainingId', as: 'training' });

module.exports = {
  User,
  Athlete,
  Training,
  TrainingDetail,
  ExternalFactor
};
