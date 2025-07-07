/* routes/analytics.js */

const express = require('express');
const {
  // Athlete‑level (individual)
  getTimeEvolution,
  //detectAnomalies,
  //getPhysioTrend,
  getLoadAndVolume,
  getEfficiencyBySeries,
  //getSessionConsistency,
  //getTotalLoad,
  //getVolume,
  //getVariability,
  getPerformanceAlerts,
  getIntraSessionConsistency,
  getVariabilityByDistance,
  getTimeSeriesMetrics,
  //getLoadAndVolume,
  //getGeneralConsistency,
  // Coach‑level (all athletes)
  //getTimeEvolutionAll,
  //detectAnomaliesAll,
  //getPhysioTrendAll,
  //getTotalLoadAll,
  //getVolumeAll,
  //getVariabilityAll
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// ────────────────────────────────────────────────────────────────────────────────
//  A T H L E T E   –  I N D I V I D U A L
// ────────────────────────────────────────────────────────────────────────────────
// Rutas para análisis de atletas individuales (requieren athleteId como query parameter)
//router.get('/time-evolution', protect, getTimeEvolution);
//router.get('/performance-alerts', protect, getPerformanceAlerts);
//router.get('/physio-trend', protect, getPhysioTrend);
//router.get('/efficiency/:trainingId', protect, getEfficiencyBySeries);
//router.get('/consistency', protect, getSessionConsistency);
//router.get('/total-load', protect, getTotalLoad);
//router.get('/volume', protect, getVolume);
//router.get('/variability', protect, getVariability);

// Rutas alternativas con el ID del atleta en la URL para mayor claridad
router.get('/athlete/:athleteId/time-evolution', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getTimeEvolution(req, res, next);
});
router.get('/athlete/:athleteId/performance-alerts', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getPerformanceAlerts(req, res, next);
});
router.get('/athlete/:athleteId/time-series-metrics', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getTimeSeriesMetrics(req, res, next);
});
router.get('/athlete/:athleteId/consistency', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getIntraSessionConsistency(req, res, next);
});
router.get('/athlete/:athleteId/total-load', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getLoadAndVolume(req, res, next);
});

router.get('/athlete/:athleteId/variability', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getVariabilityByDistance(req, res, next);
});

router.get('/athlete/:athleteId/efficiency', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getEfficiencyBySeries(req, res, next);
});

router.get('/athlete/:athleteId/general-consistency', protect, (req, res, next) => {
  req.query.athleteId = req.params.athleteId;
  getGeneralConsistency(req, res, next);
});
// ────────────────────────────────────────────────────────────────────────────────
//  C O A C H   –  A L L   A T H L E T E S
// ────────────────────────────────────────────────────────────────────────────────
//router.get('/time-evolution/all', protect, getTimeEvolutionAll);
//router.get('/anomalies/all', protect, detectAnomaliesAll);
//router.get('/physio-trend/all', protect, getPhysioTrendAll);
//router.get('/total-load/all', protect, getTotalLoadAll);
//router.get('/volume/all', protect, getVolumeAll);
//router.get('/variability/all', protect, getVariabilityAll);

module.exports = router;
