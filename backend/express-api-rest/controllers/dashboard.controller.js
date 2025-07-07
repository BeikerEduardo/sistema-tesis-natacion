const { Athlete, Training, ExternalFactor } = require('../models');
const { sequelize, Sequelize } = require('../database/config');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get total number of athletes for this coach
    const totalAthletes = await Athlete.count({
      where: { coachId: req.user.id }
    });

    // Get today's date at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get end of today
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // Get trainings scheduled for today
    const todayTrainings = await Training.count({
      where: {
        coachId: req.user.id,
        date: {
          [Op.between]: [today, endOfToday]
        }
      }
    });

    // Get first day of current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get last day of current month
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get trainings for current month
    const monthlyTrainings = await Training.count({
      where: {
        coachId: req.user.id,
        date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        }
      }
    });

    // Get personal bests (simplified - in a real app this would be more complex)
    // For now, we'll just return a random number between 5-15
    const personalBests = Math.floor(Math.random() * 11) + 5;

    // Get athlete growth (new athletes in the last week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newAthletes = await Athlete.count({
      where: {
        coachId: req.user.id,
        createdAt: {
          [Op.gte]: oneWeekAgo
        }
      }
    });

    // Generate training description based on today's trainings
    let trainingDescription = 'No hay sesiones programadas hoy';
    if (todayTrainings > 0) {
      if (todayTrainings === 1) {
        trainingDescription = '1 sesión programada hoy';
      } else {
        trainingDescription = `${todayTrainings} sesiones programadas hoy`;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalAthletes,
        todayTrainings,
        monthlyTrainings,
        personalBests,
        athleteGrowth: `+${newAthletes} desde la semana pasada`,
        trainingDescription
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get upcoming trainings
// @route   GET /api/trainings/upcoming
// @access  Private
exports.getUpcomingTrainings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    
    // Get current date and time
    const now = new Date();
    
    // Find upcoming trainings
    const trainings = await Training.findAll({
      where: {
        coachId: req.user.id,
        date: {
          [Op.gte]: now
        }
      },
      include: [
        {
          model: Athlete,
          as: 'athlete',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [
        ['date', 'ASC']
      ],
      limit
    });

    res.status(200).json({
      success: true,
      count: trainings.length,
      data: trainings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recent athletes
// @route   GET /api/athletes/recent
// @access  Private
exports.getRecentAthletes = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    
    // Find recent athletes
    const athletes = await Athlete.findAll({
      where: {
        coachId: req.user.id
      },
      order: [['createdAt', 'DESC']],
      limit
    });

    res.status(200).json({
      success: true,
      count: athletes.length,
      data: athletes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get basic system metrics
// @route   GET /api/dashboard/metrics
// @access  Private
exports.getBasicMetrics = async (req, res, next) => {
  try {
    // Get total number of athletes
    const totalAthletes = await Athlete.count({
      where: { coachId: req.user.id }
    });

    // Get total number of trainings
    const totalTrainings = await Training.count({
      where: { coachId: req.user.id }
    });

    // Get total number of external factors (incidencias)
    const totalIncidents = await ExternalFactor.count({
      include: [{
        model: Training,
        as: 'training',
        where: { coachId: req.user.id },
        attributes: []
      }]
    });

    // Get trainings by status
    const trainingsByStatus = await Training.findAll({
      where: { coachId: req.user.id },
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('Training.id')), 'count']
      ],
      group: ['status']
    });

    // Format trainings by status
    const statusCounts = {};
    trainingsByStatus.forEach(item => {
      statusCounts[item.status] = parseInt(item.dataValues.count);
    });

    // Get incidents by type
    const incidentsByType = await ExternalFactor.findAll({
      attributes: [
        'factorType',
        [Sequelize.fn('COUNT', Sequelize.col('ExternalFactor.id')), 'count']
      ],
      include: [{
        model: Training,
        as: 'training',
        where: { coachId: req.user.id },
        attributes: []
      }],
      group: ['factorType']
    });

    // Format incidents by type
    const typeCounts = {};
    incidentsByType.forEach(item => {
      typeCounts[item.factorType] = parseInt(item.dataValues.count);
    });

    res.status(200).json({
      success: true,
      data: {
        totalAthletes,
        totalTrainings,
        totalIncidents,
        trainingsByStatus: statusCounts,
        incidentsByType: typeCounts
      }
    });
  } catch (err) {
    next(err);
  }
};
