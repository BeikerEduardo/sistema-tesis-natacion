/* analyticsUtils.js */

// Import models
const { Op, fn, col, literal } = require('sequelize');
const { Training, TrainingDetail, ExternalFactor, Athlete } = require('../models');

/**
 * 1. Evolución de tiempos por prueba en los últimos N meses
 */
async function getTimeEvolution(athleteId, distance, swimStyle, months = 3) {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const records = await TrainingDetail.findAll({
    include: [{
      model: Training, as: 'training',
      where: { athleteId, date: { [Op.gte]: since } }
    }],
    where: { distance, swimStyle },
    order: [[{ model: Training, as: 'training' }, 'date', 'ASC']],
    attributes: ['timeSeconds', [col('training.date'), 'date']]
  });

  return records.map(r => ({ date: r.get('date'), time: r.timeSeconds }));
}

/**
 * 2. Detección de desempeño atípico (+/- threshold%)
 */
async function detectAnomalies(athleteId, distance, swimStyle, threshold = 0.1) {
  // Promedio histórico
  const avgResult = await TrainingDetail.findOne({
    include: [{ model: Training, as: 'training', where: { athleteId } }],
    where: { distance, swimStyle },
    attributes: [[fn('AVG', col('timeSeconds')), 'avgTime']]
  });
  const avgTime = parseFloat(avgResult.get('avgTime'));

  // Última sesión
  const last = await TrainingDetail.findOne({
    include: [{ model: Training, as: 'training', where: { athleteId } }],
    where: { distance, swimStyle },
    order: [[{ model: Training, as: 'training' }, 'date', 'DESC']],
    limit: 1
  });
  const lastTime = last.timeSeconds;

  const diff = (lastTime - avgTime) / avgTime;
  if (Math.abs(diff) >= threshold) {
    return { anomaly: true, lastTime, avgTime, diff };
  }
  return { anomaly: false, lastTime, avgTime, diff };
}

/**
 * 3. Evolución de peso, frecuencia cardiaca y estado físico subjetivo
 */
async function getPhysioTrend(athleteId, metricKey, months = 3) {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  // Mapeo de métricas válidas a columnas de la BD
  const metricMap = {
    resting: 'heartRateRest',       // Frecuencia cardíaca en reposo
    during: 'heartRateDuring',      // Frecuencia cardíaca durante ejercicio
    after: 'heartRateAfter',        // Frecuencia cardíaca post-ejercicio
    weightBefore: 'weightBefore',   // Peso antes del entrenamiento
    weightAfter: 'weightAfter'      // Peso después del entrenamiento
    // Si se agregan más métricas, extender este mapa
  };

  const column = metricMap[metricKey];
  if (!column) {
    throw new Error(`Métrica inválida: ${metricKey}`);
  }

  const trainings = await Training.findAll({
    where: { athleteId, date: { [Op.gte]: since } },
    order: [['date','ASC']],
    attributes: ['date', column]
  });

  return trainings.map(t => ({ date: t.date, value: t.get(column) }));
}

/**
 * 4. Eficiencia por serie
 */
async function getEfficiencyBySeries(trainingId) {
  const details = await TrainingDetail.findAll({ where: { trainingId } });

  // Agrupar por series
  const seriesMap = {};
  details.forEach(d => {
    const s = d.seriesNumber || 1;
    if (!seriesMap[s]) seriesMap[s] = [];
    seriesMap[s].push(d.efficiency);
  });

  return Object.entries(seriesMap).map(([series, effs]) => ({
    series: parseInt(series,10),
    averageEfficiency: effs.reduce((a,b) => a + b, 0) / effs.length
  }));
}

/**
 * 5. Consistencia dentro de una sesión (std dev de tiempos)
 * Modificado para trabajar con athleteId o trainingId
 */
async function getSessionConsistency(idParam, distance, swimStyle, sessions = 5) {
  let details = [];
  
  // Determinar si estamos usando athleteId o trainingId
  if (idParam && !isNaN(idParam)) {
    if (sessions) {
      // Si tenemos athleteId, buscamos los últimos N entrenamientos de ese atleta
      const trainings = await Training.findAll({
        where: { athleteId: idParam },
        order: [['date', 'DESC']],
        limit: sessions
      });
      
      // Obtenemos los IDs de esos entrenamientos
      const trainingIds = trainings.map(t => t.id);
      
      // Buscamos los detalles de esos entrenamientos
      details = await TrainingDetail.findAll({
        where: {
          trainingId: { [Op.in]: trainingIds },
          distance,
          swimStyle
        }
      });
    } else {
      // Si no hay sessions, asumimos que es un trainingId directamente
      details = await TrainingDetail.findAll({
        where: { trainingId: idParam, distance, swimStyle }
      });
    }
  }
  
  // Si no hay datos, devolvemos valores por defecto
  if (!details.length) {
    return { mean: 0, stddev: 0 };
  }
  
  // Calculamos la media y desviación estándar
  const times = details.map(d => d.timeSeconds);
  const mean = times.reduce((a,b) => a + b, 0) / times.length;
  const variance = times.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / times.length;
  const stddev = Math.sqrt(variance);
  
  return { mean, stddev };
}

/**
 * 6. Carga total semanal/mensual (duración y distancia)
 */
async function getTotalLoad(athleteId, period = 'week') {
  const now = new Date();
  let start;
  if (period === 'week') {
    start = new Date(now);
    start.setDate(now.getDate() - 7);
  } else {
    start = new Date(now);
    start.setMonth(now.getMonth() - 1);
  }

  const trainings = await Training.findAll({
    where: { athleteId, date: { [Op.gte]: start, [Op.lte]: now } },
    include: [{ model: TrainingDetail, as: 'details', attributes: ['distance'] }],
    attributes: ['durationMinutes']
  });

  const totalTime = trainings.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalDistance = trainings.reduce((sum, t) => sum + t.details.reduce((dSum, d) => dSum + d.distance, 0), 0);

  return { totalTime, totalDistance };
}

/**
 * 7. Volumen total entrenado para sobreentrenamiento (personalizable)
 */
async function getVolume(athleteId, sinceDate) {
  const trainings = await Training.findAll({
    where: { athleteId, date: { [Op.gte]: sinceDate } },
    include: [{ model: TrainingDetail, as: 'details', attributes: ['distance', 'timeSeconds'] }]
  });
  const volume = trainings.map(t => ({
    date: t.date,
    time: t.durationMinutes,
    distance: t.details.reduce((s,d) => s + d.distance, 0)
  }));
  return volume;
}

/**
 * 8. Variabilidad de tiempos en misma distancia
 */
async function getVariability(athleteId, distance, swimStyle, sessions = 5) {
  const trainings = await Training.findAll({
    where: { athleteId },
    include: [{ model: TrainingDetail, as: 'details', where: { distance, swimStyle } }],
    order: [['date','DESC']],
    limit: sessions
  });

  return trainings.map(t => {
    const times = t.details.map(d => d.timeSeconds);
    const mean = times.reduce((a,b) => a + b,0)/times.length;
    const variance = times.reduce((sum,t) => sum + Math.pow(t-mean,2),0)/times.length;
    const stddev = Math.sqrt(variance);
    return { date: t.date, mean, stddev };
  });
}


// ALL

// Función auxiliar para calcular la fecha desde hace X meses
function getSinceDate(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

async function getTimeEvolutionAll(coachId, distance, swimStyle, months = 3) {
  const since = getSinceDate(months);

  const records = await TrainingDetail.findAll({
    include: [{
      model: Training,
      as: 'training',
      attributes: [],
      required: true,
      where: { date: { [Op.gte]: since } },
      include: [{
        model: Athlete,
        as: 'athlete',
        attributes: [],
        where: { coachId }
      }]
    }],
    where: { distance, swimStyle },
    attributes: [
      [col('training.date'), 'date'],
      [fn('AVG', col('timeSeconds')), 'avgTime']
    ],
    group: [col('training.date')],
    order: [[col('training.date'), 'ASC']]
  });

  return records.map(r => ({ date: r.get('date'), avgTime: parseFloat(r.get('avgTime')) }));
}

async function detectAnomaliesAll(coachId, distance, swimStyle, threshold = 0.1) {
  const athletes = await Athlete.findAll({ where: { coachId }, attributes: ['id', 'firstName', 'lastName'] });

  const results = [];
  for (const athlete of athletes) {
    const res = await detectAnomalies(athlete.id, distance, swimStyle, threshold);
    if (res.anomaly) {
      results.push({ athleteId: athlete.id, name: `${athlete.firstName} ${athlete.lastName}`, ...res });
    }
  }
  return results;
}

async function getPhysioTrendAll(coachId, metric, months = 3) {
  const since = getSinceDate(months);
  const trainings = await Training.findAll({
    include: [{ model: Athlete, as: 'athlete', attributes: [], where: { coachId } }],
    where: { date: { [Op.gte]: since } },
    attributes: [
      'date',
      [fn('AVG', col(metric)), 'avgValue']
    ],
    group: ['date'],
    order: [['date', 'ASC']]
  });
  return trainings.map(t => ({ date: t.date, avgValue: parseFloat(t.get('avgValue')) }));
}

async function getTotalLoadAll(coachId, period = 'week') {
  const now = new Date();
  const start = new Date(now);
  period === 'week' ? start.setDate(now.getDate() - 7) : start.setMonth(now.getMonth() - 1);

  const trainings = await Training.findAll({
    include: [{ model: Athlete, as: 'athlete', attributes: [], where: { coachId } }, { model: TrainingDetail, as: 'details', attributes: ['distance'] }],
    where: { date: { [Op.between]: [start, now] } },
    attributes: ['durationMinutes']
  });

  const totalTime = trainings.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalDistance = trainings.reduce((sum, t) => sum + t.details.reduce((dSum, d) => dSum + d.distance, 0), 0);
  return { totalTime, totalDistance };
}

async function getVolumeAll(coachId, sinceDate) {
  const trainings = await Training.findAll({
    include: [{ model: Athlete, as: 'athlete', attributes: [], where: { coachId } }, { model: TrainingDetail, as: 'details', attributes: ['distance'] }],
    where: { date: { [Op.gte]: sinceDate } },
    attributes: ['date', 'durationMinutes']
  });

  // Aggregate by date
  const agg = {};
  trainings.forEach(t => {
    const key = t.date.toISOString().split('T')[0];
    if (!agg[key]) agg[key] = { date: t.date, time: 0, distance: 0 };
    agg[key].time += t.durationMinutes;
    agg[key].distance += t.details.reduce((s, d) => s + d.distance, 0);
  });
  return Object.values(agg).sort((a, b) => new Date(a.date) - new Date(b.date));
}

async function getVariabilityAll(coachId, distance, swimStyle, sessions = 5) {
  const athletes = await Athlete.findAll({ where: { coachId }, attributes: ['id'] });

  const aggregated = [];
  for (const athlete of athletes) {
    const v = await getVariability(athlete.id, distance, swimStyle, sessions);
    if (v.length) aggregated.push(...v.map(entry => ({ athleteId: athlete.id, ...entry })));
  }
  return aggregated;
}




module.exports = {
  // Athlete‑level
  getTimeEvolution,
  detectAnomalies,
  getPhysioTrend,
  getEfficiencyBySeries,
  getSessionConsistency,
  getTotalLoad,
  getVolume,
  getVariability,

  // Coach‑level (all athletes)
  getTimeEvolutionAll,
  detectAnomaliesAll,
  getPhysioTrendAll,
  getTotalLoadAll,
  getVolumeAll,
  getVariabilityAll
};
