const { Op, fn, col, literal } = require('sequelize');
const { Athlete, Training, TrainingDetail } = require('../models/index');


class AnalyticsService {
    /**
     * 1. Evolución de tiempo por prueba en los últimos N meses
     */
    static async getTimeEvolution(athleteId, distance, swimStyle, months = 3, coachId) {
        
        // Verificar que el atleta pertenece al entrenador
        const athlete = await Athlete.findOne({
            where: {
                id: athleteId,
                coachId
            }
        });

        if (!athlete) {
            throw new Error('Atleta no encontrado o no pertenece a este entrenador');
        }

        const sinceDate = new Date();
        sinceDate.setMonth(sinceDate.getMonth() - months);

        // Construir condiciones de búsqueda
        const whereConditions = {
            athleteId,
            date: { [Op.gte]: sinceDate }
        };
        
        // Filtros adicionales si se proporcionan
        const detailConditions = {};
        if (distance) detailConditions.distance = distance;
        if (swimStyle) detailConditions.swimStyle = swimStyle;

        const records = await TrainingDetail.findAll({
            where: detailConditions,
            include: [{
                model: Training,
                as: 'training',
                where: whereConditions,
                attributes: ['date']
            }],
            order: [[{ model: Training, as: 'training' }, 'date', 'ASC']]
        });

        return records.map(r => ({
            date: r.training.date,
            distance: r.distance,
            style: r.swimStyle,
            timeSeconds: r.timeSeconds
        }));
    }

    /**
     * 2. Alertas de desempeño atípico (10% más lento que el promedio)
     */
    static async checkPerformanceAlerts(athleteId, coachId) {
        // Verificar que el atleta pertenece al entrenador
        const athlete = await Athlete.findOne({
            where: {
                id: athleteId,
                coachId
            }
        });

        if (!athlete) {
            throw new Error('Atleta no encontrado o no pertenece a este entrenador');
        }

        // Promedio por distancia
        const avgByDistance = await TrainingDetail.findAll({
            include: [{
                model: Training,
                as: 'training',
                where: { athleteId },
                attributes: []
            }],
            attributes: [
                'distance',
                [fn('AVG', col('timeSeconds')), 'avgTime']
            ],
            group: ['distance']
        });

        const alerts = [];
        for (const { distance, dataValues } of avgByDistance) {
            const avgTime = parseFloat(dataValues.avgTime);
            // Último registro de esa distancia
            const last = await TrainingDetail.findOne({
                include: [{ model: Training, as: 'training', where: { athleteId } }],
                where: { distance },
                order: [['createdAt', 'DESC']]
            });
            if (last && last.timeSeconds > avgTime * 1.1) {
                alerts.push({
                    distance,
                    time: last.timeSeconds,
                    avgTime,
                    date: last.createdAt
                });
            }
        }
        return alerts;
    }

    /**
     * Método para mantener compatibilidad con el controlador
     */
    static async getPerformanceAlerts(athleteId, coachId) {
        return this.checkPerformanceAlerts(athleteId, coachId);
    }

    /**
     * 3. Gráficos de peso, frecuencia cardiaca y estado físico a lo largo del tiempo
     */
    static async getTimeSeriesMetrics(athleteId, coachId) {
        // Verificar que el atleta pertenece al entrenador
        const athlete = await Athlete.findOne({
            where: {
                id: athleteId,
                coachId
            }
        });

        if (!athlete) {
            throw new Error('Atleta no encontrado o no pertenece a este entrenador');
        }

        const trainings = await Training.findAll({
            where: { athleteId },
            attributes: [
                'date',
                'weightBefore',
                'heartRateRest',
                'heartRateDuring',
                'heartRateAfter',
                'physicalStateRating'
            ],
            order: [['date', 'ASC']]
        });

        return trainings.map(t => ({
            date: t.date,
            weight: t.weightBefore,
            hrRest: t.heartRateRest,
            hrDuring: t.heartRateDuring,
            hrAfter: t.heartRateAfter,
            physicalState: t.physicalStateRating
        }));
    }

    /**
     * 4. Análisis de eficiencia por serie
     */
    static async getEfficiencyBySeries(athleteId, coachId) {
        // Verificar que el atleta pertenece al entrenador
        const athlete = await Athlete.findOne({
            where: {
                id: athleteId,
                coachId
            }
        });

        if (!athlete) {
            throw new Error('Atleta no encontrado o no pertenece a este entrenador');
        }

        const trainings = await Training.findAll({
            where: { athleteId },
            attributes: ['id']
        });

        const trainingIds = trainings.map(t => t.id);

        const results = await TrainingDetail.findAll({
            where: { 
                trainingId: { [Op.in]: trainingIds } 
            },
            attributes: [
                'seriesNumber',
                [fn('AVG', col('efficiency')), 'avgEff']
            ],
            group: ['seriesNumber'],
            order: [['seriesNumber', 'ASC']]
        });

        return results.map(r => ({
            series: r.seriesNumber,
            avgEfficiency: parseFloat(r.dataValues.avgEff)
        }));
    }

    /**
     * 5. Consistencia intra-sesión (desviación estándar de tiempos por serie)
     */
    static async getIntraSessionConsistency(athleteId, coachId) {
        // Verificar que el atleta pertenece al entrenador
        const athlete = await Athlete.findOne({
            where: {
                id: athleteId,
                coachId
            }
        });

        if (!athlete) {
            throw new Error('Atleta no encontrado o no pertenece a este entrenador');
        }

        const trainings = await Training.findAll({
            where: { athleteId },
            attributes: ['id']
        });

        const trainingIds = trainings.map(t => t.id);

        const results = await TrainingDetail.findAll({
            where: { 
                trainingId: { [Op.in]: trainingIds } 
            },
            attributes: [
                'seriesNumber',
                [fn('STDDEV_SAMP', col('timeSeconds')), 'stdDev']
            ],
            group: ['seriesNumber'],
            order: [['seriesNumber', 'ASC']]
        });

        return results.map(r => ({
            series: r.seriesNumber,
            stdDev: parseFloat(r.dataValues.stdDev)
        }));
    }

    /**
     * 6. Carga total semanal/mensual y volumen entrenado
     */
    static async getLoadAndVolume(athleteId, coachId) {
        // Verificar que el atleta pertenece al entrenador
        const athlete = await Athlete.findOne({
            where: {
                id: athleteId,
                coachId
            }
        });

        if (!athlete) {
            throw new Error('Atleta no encontrado o no pertenece a este entrenador');
        }

        // Semanal
        const weekly = await Training.findAll({
            where: { athleteId },
            attributes: [
                [fn('YEARWEEK', col('date')), 'week'],
                [fn('SUM', col('durationMinutes')), 'totalMinutes']
            ],
            group: [literal('week')]
        });
        // Volumen distancia semanal
        const weeklyDist = await TrainingDetail.findAll({
            include: [{ model: Training, as: 'training', where: { athleteId } }],
            attributes: [
                [fn('YEARWEEK', col('training.date')), 'week'],
                [fn('SUM', col('distance')), 'totalMeters']
            ],
            group: [literal('week')]
        });
        return {
            weeklyDuration: weekly.map(r => ({ week: r.dataValues.week, minutes: parseInt(r.dataValues.totalMinutes) })),
            weeklyDistance: weeklyDist.map(r => ({ week: r.dataValues.week, meters: parseInt(r.dataValues.totalMeters) }))
        };
    }

    /**
     * 7. Consistencia general del atleta (coef. de variación de sesiones semanales)
     */
    static async getGeneralConsistency(athleteId, coachId, weeks = 12) {
        // Verificar que el atleta pertenece al entrenador
        const athlete = await Athlete.findOne({
            where: {
                id: athleteId,
                coachId
            }
        });

        if (!athlete) {
            throw new Error('Atleta no encontrado o no pertenece a este entrenador');
        }

        const since = new Date();
        since.setDate(since.getDate() - weeks * 7);

        const counts = await Training.findAll({
            where: { athleteId, date: { [Op.gte]: since } },
            attributes: [
                [fn('YEARWEEK', col('date')), 'week'],
                [fn('COUNT', col('id')), 'sessions']
            ],
            group: [literal('week')]
        });

        const sessions = counts.map(r => parseInt(r.dataValues.sessions));
        const mean = sessions.reduce((a, b) => a + b, 0) / sessions.length;
        const variance = sessions.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (sessions.length - 1);
        const stdDev = Math.sqrt(variance);
        return { coefficientOfVariation: stdDev / mean };
    }

    /**
     * 8. Variabilidad en una misma distancia
     */
    static async getVariabilityByDistance(athleteId, distance) {
        const results = await TrainingDetail.findAll({
            include: [{ model: Training, as: 'training', where: { athleteId } }],
            where: { distance },
            attributes: [
                [fn('VAR_SAMP', col('timeSeconds')), 'variance'],
                [fn('STDDEV_SAMP', col('timeSeconds')), 'stdDev']
            ]
        });
        const vals = results[0].dataValues;
        return { distance, variance: parseFloat(vals.variance), stdDev: parseFloat(vals.stdDev) };
    }
}

module.exports = AnalyticsService;