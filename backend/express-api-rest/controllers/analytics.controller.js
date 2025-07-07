const AnalyticsService = require('../services/analytics.service');

exports.getTimeEvolution = async (req, res, next) => {
  try {
    const { athleteId, distance, swimStyle, months } = req.query;
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getTimeEvolution(
      athleteId,
      distance,
      swimStyle,
      months ? months : 3,
      req.user.id // Pasar el ID del coach para validación
    );
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getPerformanceAlerts = async (req, res, next) => {
  try {
    const { athleteId } = req.query;
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getPerformanceAlerts(+athleteId, req.user.id);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getTimeSeriesMetrics = async (req, res, next) => {
  try {
    const { athleteId } = req.query;
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getTimeSeriesMetrics(+athleteId, req.user.id);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getEfficiencyBySeries = async (req, res, next) => {
  try {
    const { athleteId } = req.query;
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getEfficiencyBySeries(+athleteId, req.user.id);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getIntraSessionConsistency = async (req, res, next) => {
  try {
    const { athleteId } = req.query;
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getIntraSessionConsistency(+athleteId, req.user.id);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getLoadAndVolume = async (req, res, next) => {
  try {
    const { athleteId } = req.query;
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getLoadAndVolume(+athleteId, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}; 

exports.getGeneralConsistency = async (req, res, next) => {
  try {
    const { athleteId } = req.query;
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getGeneralConsistency(+athleteId, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getVariabilityByDistance = async (req, res, next) => {
  try {
    const { athleteId, distance } = req.query;
    
    if(!distance){
        return res.status(400).json({ success: false, message: 'Se requiere la distancia' });
    }
    
    if (!athleteId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID del atleta' });
    }
    
    const data = await AnalyticsService.getVariabilityByDistance(athleteId, distance);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};