// database/seedDb.js

const { sequelize } = require('./config');
const { Training, TrainingDetail, ExternalFactor } = require('../models');
const { createAppUsers } = require('./seeders/utils/users.seederUtils');
const { createAthletes } = require('./seeders/utils/athletes.seederUtils');
const { generateTraining, generateWorkoutSeries, generateRealisticTime, generateExternalFactors } = require('./seeders/utils/trainings.seederUtils');
const { getRandomInt, getRandomFloat } = require('../utils/random');
const { subDays } = require('../utils/dates');

// Helper to insert in batches to avoid packet too large
async function bulkInsertInBatches(Model, records, batchSize = 1000) {
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await Model.bulkCreate(batch);
    console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(records.length / batchSize)}`);
  }
}

const trainingTypeToSpanish = (trainingType) => {
  switch (trainingType) {
    case 'speed':
      return 'Velocidad';
    case 'endurance':
      return 'Endurance';
    case 'strength':
      return 'Fuerza';
    case 'flexibility':
      return 'Flexibilidad';
    default:
      return 'Entrenamiento';
  }
}

const seedDatabase = async () => {
  console.log('Iniciando seeding de la base de datos...');
  try {
    // Conexión y sync
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized. All tables recreated.');

    // Usuarios
    const users = await createAppUsers();
    console.log(`${users.length} usuarios creados`);
    const mainCoach = users.find(u => u.email === 'ent@app.com');
    const assistantCoach = users.find(u => u.email === 'asis@app.com');

    // Atletas
    const athletesData = [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        dateOfBirth: new Date(2005, 5, 15),
        category: 'Senior',
        height: 182,
        weight: 75.5,
        gender: 'male',
        phone: '555-123-4567',
        email: 'juan@example.com',
        specialtyStroke: 'freestyle',
        preferredDistance: 200,
        personalBest: { '200m freestyle': '01:58.45' },
        coachId: mainCoach.id
      },
      {
        firstName: 'María',
        lastName: 'González',
        dateOfBirth: new Date(2007, 3, 22),
        category: 'Junior',
        height: 165,
        weight: 58.2,
        gender: 'female',
        phone: '555-987-6543',
        email: 'maria@example.com',
        specialtyStroke: 'butterfly',
        preferredDistance: 100,
        personalBest: { '100m butterfly': '01:05.32' },
        coachId: mainCoach.id
      },
      {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        dateOfBirth: new Date(2003, 8, 10),
        category: 'Senior',
        height: 178,
        weight: 72.0,
        gender: 'male',
        phone: '555-456-7890',
        email: 'carlos@example.com',
        specialtyStroke: 'backstroke',
        preferredDistance: 100,
        personalBest: { '100m backstroke': '01:02.18' },
        coachId: mainCoach.id
      },
      {
        firstName: 'Ana',
        lastName: 'Martínez',
        dateOfBirth: new Date(2008, 1, 5),
        category: 'Junior',
        height: 162,
        weight: 54.8,
        gender: 'female',
        phone: '555-234-5678',
        email: 'ana@example.com',
        specialtyStroke: 'breaststroke',
        preferredDistance: 200,
        personalBest: { '200m breaststroke': '02:42.75' },
        coachId: mainCoach.id
      },
      {
        firstName: 'Miguel',
        lastName: 'Sánchez',
        dateOfBirth: new Date(2006, 7, 18),
        category: 'Junior',
        height: 175,
        weight: 68.3,
        gender: 'male',
        phone: '555-876-5432',
        email: 'miguel@example.com',
        specialtyStroke: 'freestyle',
        preferredDistance: 400,
        personalBest: { '400m freestyle': '04:12.60' },
        coachId: assistantCoach.id
      },
      {
        firstName: 'Laura',
        lastName: 'Gómez',
        dateOfBirth: new Date(2004, 11, 3),
        category: 'Senior',
        height: 168,
        weight: 62.1,
        gender: 'female',
        phone: '555-345-6789',
        email: 'laura@example.com',
        specialtyStroke: 'medley',
        preferredDistance: 200,
        personalBest: { '200m medley': '02:24.90' },
        coachId: assistantCoach.id
      },
      {
        firstName: 'Daniel',
        lastName: 'López',
        dateOfBirth: new Date(2007, 4, 25),
        category: 'Junior',
        height: 172,
        weight: 65.7,
        gender: 'male',
        phone: '555-567-8901',
        email: 'daniel@example.com',
        specialtyStroke: 'butterfly',
        preferredDistance: 50,
        personalBest: { '50m butterfly': '00:27.85' },
        coachId: mainCoach.id
      },
      {
        firstName: 'Sofía',
        lastName: 'Hernández',
        dateOfBirth: new Date(2009, 2, 14),
        category: 'Junior',
        height: 158,
        weight: 51.4,
        gender: 'female',
        phone: '555-678-9012',
        email: 'sofia@example.com',
        specialtyStroke: 'freestyle',
        preferredDistance: 100,
        personalBest: { '100m freestyle': '01:02.40' },
        coachId: mainCoach.id
      }
    ];
    const athletes = await createAthletes(athletesData);
    console.log(`${athletes.length} atletas creados`);

    // Generar entrenamientos para un año completo
    const trainingSessions = [];
    const currentDate = new Date();

    for (const athlete of athletes) {
      const coachId = athlete.coachId;
      const numTrainings = getRandomInt(150, 250);

      for (let i = 0; i < numTrainings; i++) {
        const daysAgo = Math.floor((365 / numTrainings) * i) + getRandomInt(0, 3);
        const trainingDate = subDays(currentDate, daysAgo);

        const training = generateTraining(athlete, trainingDate, coachId, i);

        training.title = `Entrenamiento de ${athlete.firstName} ${athlete.lastName}`;
        training.description = `Sesión de ${trainingTypeToSpanish(training.trainingType)} realizada el ${trainingDate.toLocaleDateString()}`;
        const LOCATIONS = ['Piscina Central', 'Piscina Norte', 'Piscina Sur'];
        training.location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

        if (trainingSessions.some(t =>
          t.athleteId === athlete.id &&
          new Date(t.date).toDateString() === trainingDate.toDateString()
        )) continue;

        trainingSessions.push(training);
      }
    }

    // Inserción por lotes
    console.log('Insertando training sessions...');
    await bulkInsertInBatches(Training, trainingSessions, 1000);

    // Obtener todas las sesiones creadas
    const createdTrainings = await Training.findAll({ attributes: ['id', 'athleteId', 'date', 'trainingType'] });
    console.log(`${createdTrainings.length} training sessions loaded for details generation`);

    // Generar detalles de entrenamiento
    const trainingDetails = [];
    for (const training of createdTrainings) {
      const athlete = athletes.find(a => a.id === training.athleteId);
      const workoutSeries = generateWorkoutSeries(training, athlete);
      let seriesNumber = 1;

      for (const series of workoutSeries) {
        for (let rep = 1; rep <= series.repetitions; rep++) {
          const timeSeconds = generateRealisticTime(
            series.distance, series.swimStyle, athlete, training.trainingType, new Date(training.date)
          );
          let efficiency = series.swimStyle === athlete.specialtyStroke
            ? getRandomFloat(7, 10)
            : getRandomFloat(5, 8.5);
          if (['high', 'max'].includes(series.intensity)) efficiency *= getRandomFloat(0.9, 1.0);
          const strokesPerMeter = series.swimStyle === 'breaststroke' ? 0.5 : series.swimStyle === 'butterfly' ? 0.6 : 0.7;
          const strokeCount = Math.round(series.distance * strokesPerMeter * (1 - (efficiency - 5) / 10));
          let notes = null;
          if (timeSeconds < generateRealisticTime(series.distance, series.swimStyle, athlete, 'speed', new Date(training.date)) * 0.95) notes = 'Excelente desempeño';
          else if (efficiency > 8.5) notes = 'Gran técnica';
          else if (efficiency < 6) notes = 'Necesita mejorar';

          trainingDetails.push({
            trainingId: training.id,
            distance: series.distance || 100,
            swimStyle: ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'medley'].includes(series.swimStyle) ? series.swimStyle : 'freestyle',
            timeSeconds: isNaN(timeSeconds) || timeSeconds <= 0 ? 60 : timeSeconds,
            seriesNumber,
            repetitionNumber: rep,
            restIntervalSeconds: series.rest || 30,
            strokeCount: isNaN(strokeCount) || strokeCount <= 0 ? 30 : strokeCount,
            efficiency: isNaN(efficiency) || efficiency <= 0 ? 7.5 : efficiency,
            notes: notes ? `${notes} (${series.intensity})` : `${series.intensity} intensity`
          });
        }
        seriesNumber++;
      }
    }

    console.log('Insertando training details...');
    await bulkInsertInBatches(TrainingDetail, trainingDetails, 1000);

    // Factores externos
    const externalFactors = generateExternalFactors(athletes, createdTrainings);
    for (const factor of externalFactors) {
      if (factor.startDate && factor.endDate && !factor.trainingId) {
        const match = createdTrainings.find(t =>
          t.athleteId === factor.athleteId &&
          new Date(t.date) >= new Date(factor.startDate) &&
          new Date(t.date) <= new Date(factor.endDate)
        );
        if (match) factor.trainingId = match.id;
      }
    }

    console.log('Insertando external factors...');
    await bulkInsertInBatches(ExternalFactor, externalFactors, 1000);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
  finally{
    await sequelize.close();
    process.exit(0);
  }
};

seedDatabase();
