const { sequelize } = require('../database/config');
const { Training, TrainingDetail, Athlete, ExternalFactor } = require('../models');
const { Op } = require('sequelize');

class TrainingService {

    static async getTrainings({
        coachId,
        athleteId,
        startDate,
        endDate,
        trainingType,
        page = 1,
        limit = 10,
        sort = 'date',
        order = 'desc',
    }) {
        try {
            // ➜ 1. Normaliza y valida paginación
            const pageNum = Math.max(1, Number(page));
            const limitNum = Math.max(1, Number(limit));
            const offset = (pageNum - 1) * limitNum;

            // ➜ 2. Construye filtros
            const where = { coachId };

            if (athleteId) where.athleteId = athleteId;
            if (trainingType) where.trainingType = trainingType;

            if (startDate || endDate) {
                where.date = {};
                if (startDate) where.date[Op.gte] = new Date(startDate);
                if (endDate) where.date[Op.lte] = new Date(endDate);
            }

            // ➜ 3. Sanitiza sort / order
            const validSortFields = [
                'date', 'createdAt', 'updatedAt', 'trainingType', 'status',
                // añade aquí columnas permitidas
            ];
            if (!validSortFields.includes(sort)) sort = 'date';

            const cleanOrder = order.toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            // ➜ 4. Cuenta total y extrae página
            const { count: total, rows: trainings } = await Training.findAndCountAll({
                where,
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
                order: [[sort, cleanOrder]],
                offset,
                limit: limitNum,
                attributes: [
                    'id', 'title', 'description', 'location', 'status', 'date', 'trainingType',
                    'durationMinutes', 'isOutdoor', 'temperature', 'humidity', 'weatherCondition',
                    'heartRateRest', 'heartRateDuring', 'heartRateAfter', 'weightBefore', 'weightAfter',
                    'breathingPattern', 'physicalStateRating', 'painReported', 'swimsuitType',
                    'equipmentUsed', 'notes', 'startTime', 'endTime', 'createdAt', 'updatedAt',
                    'athleteId', 'coachId',
                ],
            });

            // ➜ 5. Devuelve en tu formato
            return {
                success: true,
                count: trainings.length,
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                data: trainings,
            };
        } catch (err) {
            // Mantén el error para el controlador
            throw err;
        }
    }

    static async getTraining(trainingId, coachId) {
        try {
            const training = await Training.findOne({
                where: {
                    id: trainingId,
                    coachId
                },
                attributes: [
                    'id', 'title', 'description', 'location', 'status', 'date', 'trainingType',
                    'durationMinutes', 'isOutdoor', 'temperature', 'humidity', 'weatherCondition',
                    'heartRateRest', 'heartRateDuring', 'heartRateAfter', 'weightBefore', 'weightAfter',
                    'breathingPattern', 'physicalStateRating', 'painReported', 'swimsuitType',
                    'equipmentUsed', 'notes', 'startTime', 'endTime', 'createdAt', 'updatedAt', 'athleteId', 'coachId'
                ],
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: TrainingDetail,
                        as: 'details',
                        attributes: [
                            'id', 'distance', 'swimStyle', 'timeSeconds', 'notes',
                            'seriesNumber', 'repetitionNumber', 'restIntervalSeconds',
                            'strokeCount', 'efficiency',
                            'createdAt', 'updatedAt', 'trainingId'
                        ]
                    },
                    {
                        model: ExternalFactor,
                        as: 'externalFactors',
                        attributes: ['id', 'factorType', 'description', 'severity', 'notes', 'createdAt', 'updatedAt', 'trainingId']
                    }
                ]
            });

            if (!training) {
                throw new Error('Training not found');
            }

            return {
                success: true,
                data: training
            };
        } catch (err) {
            throw err;
        }

    }

    static async createTraining(newTrainingData) {
        try {

            if (!newTrainingData) {
                throw new Error('Training data is required');
            }

            const { details: trainingDetails, externalFactors, ...trainingData } = newTrainingData;

            // Add coach ID to request body
            trainingData.coachId = trainingData.coachId;

            // Verify athlete belongs to coach
            const athlete = await Athlete.findOne({
                where: {
                    id: trainingData.athleteId,
                    coachId: trainingData.coachId
                }
            });

            if (!athlete) {
                throw new Error('Athlete not found or does not belong to this coach');
            }

            // Create training with transaction to ensure all related data is saved or none
            const result = await sequelize.transaction(async (t) => {
                // Create the training
                const training = await Training.create({
                    athleteId: trainingData.athleteId,
                    coachId: trainingData.coachId,
                    date: trainingData.date,
                    trainingType: trainingData.trainingType,
                    durationMinutes: trainingData.durationMinutes,
                    isOutdoor: trainingData.isOutdoor || false,
                    temperature: trainingData.temperature,
                    humidity: trainingData.humidity,
                    weatherCondition: trainingData.weatherCondition,
                    heartRateRest: trainingData.heartRateRest,
                    heartRateDuring: trainingData.heartRateDuring,
                    heartRateAfter: trainingData.heartRateAfter,
                    weightBefore: trainingData.weightBefore,
                    weightAfter: trainingData.weightAfter,
                    breathingPattern: trainingData.breathingPattern,
                    physicalStateRating: trainingData.physicalStateRating,
                    painReported: trainingData.painReported,
                    swimsuitType: trainingData.swimsuitType,
                    equipmentUsed: trainingData.equipmentUsed,
                    notes: trainingData.notes,
                    title: trainingData.title,
                    description: trainingData.description,
                    location: trainingData.location,
                    status: trainingData.status || 'scheduled',
                    startTime: trainingData.startTime,
                    endTime: trainingData.endTime
                }, { transaction: t });

                // Create training details if provided
                if (trainingDetails && trainingDetails.length > 0) {
                    const detailsWithTrainingId = trainingDetails.map(detail => {
                        // Map style to swimStyle if it exists
                        const mappedDetail = {
                            ...detail,
                            trainingId: training.id
                        };
                        
                        // Eliminar el ID de los detalles para que la base de datos genere uno nuevo
                        // La columna id es INTEGER con autoIncrement
                        delete mappedDetail.id;

                        return mappedDetail;
                    });

                    await TrainingDetail.bulkCreate(detailsWithTrainingId, { transaction: t });
                }

                // Create external factors if provided
                if (externalFactors && externalFactors.length > 0) {
                    const factorsWithIds = externalFactors.map(factor => ({
                        ...factor,
                        trainingId: training.id,
                        athleteId: trainingData.athleteId
                    }));

                    await ExternalFactor.bulkCreate(factorsWithIds, { transaction: t });
                }

                return training;
            });

            // Get the complete training with all related data
            const completeTraining = await Training.findByPk(result.id, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: TrainingDetail,
                        as: 'details'
                    },
                    {
                        model: ExternalFactor,
                        as: 'externalFactors'
                    }
                ]
            });

            return {
                success: true,
                data: completeTraining
            };
        } catch (err) {
            throw err;
        }
    }

    static async updateTraining(trainingId, updatedTrainingData) {
        try {

            if (!updatedTrainingData) {
                throw new Error('Training data is required');
            }

            const { details, externalFactors, ...trainingData } = updatedTrainingData;

            // Find training
            let training = await Training.findOne({
                where: {
                    id: trainingId,
                    coachId: trainingData.coachId,
                }
            });

            if (!training) {
                throw new Error('Training not found');
            }

            // If changing athlete, verify new athlete belongs to coach
            if (trainingData.athleteId && trainingData.athleteId !== training.athleteId) {
                const athlete = await Athlete.findOne({
                    where: {
                        id: trainingData.athleteId,
                        coachId: trainingData.coachId
                    }
                });

                if (!athlete) {
                    throw new Error('Athlete not found or does not belong to this coach');
                }
            }

            // Update with transaction
            await sequelize.transaction(async (t) => {
                // Update the training
                const [updated] = await Training.update({
                    athleteId: trainingData.athleteId,
                    date: trainingData.date,
                    trainingType: trainingData.trainingType,
                    durationMinutes: trainingData.durationMinutes,
                    isOutdoor: trainingData.isOutdoor,
                    temperature: trainingData.temperature,
                    humidity: trainingData.humidity,
                    weatherCondition: trainingData.weatherCondition,
                    heartRateRest: trainingData.heartRateRest,
                    heartRateDuring: trainingData.heartRateDuring,
                    heartRateAfter: trainingData.heartRateAfter,
                    weightBefore: trainingData.weightBefore,
                    weightAfter: trainingData.weightAfter,
                    breathingPattern: trainingData.breathingPattern,
                    physicalStateRating: trainingData.physicalStateRating,
                    painReported: trainingData.painReported,
                    swimsuitType: trainingData.swimsuitType,
                    equipmentUsed: trainingData.equipmentUsed,
                    notes: trainingData.notes,
                    title: trainingData.title,
                    description: trainingData.description,
                    location: trainingData.location,
                    status: trainingData.status,
                    startTime: trainingData.startTime,
                    endTime: trainingData.endTime
                }, {
                    where: {
                        id: trainingId,
                        coachId: trainingData.coachId
                    },
                    transaction: t
                });

                // Update training details if provided
                if (details) {
                    // Delete existing details
                    await TrainingDetail.destroy({
                        where: { trainingId: training.id },
                        transaction: t
                    });

                    // Create new details
                    if (details.length > 0) {
                        const detailsWithTrainingId = details.map(detail => {
                            // Map style to swimStyle if it exists
                            const mappedDetail = {
                                ...detail,
                                trainingId: training.id
                            };

                            return mappedDetail;
                        });

                        await TrainingDetail.bulkCreate(detailsWithTrainingId, { transaction: t });
                    }
                }

                // Update external factors if provided
                if (externalFactors) {
                    // Delete existing factors associated with this training
                    await ExternalFactor.destroy({
                        where: { trainingId: training.id },
                        transaction: t
                    });

                    // Create new factors
                    if (externalFactors.length > 0) {
                        const factorsWithIds = externalFactors.map(factor => ({
                            ...factor,
                            trainingId: training.id,
                            athleteId: trainingData.athleteId || training.athleteId
                        }));

                        await ExternalFactor.bulkCreate(factorsWithIds, { transaction: t });
                    }
                }
            });

            // Get updated training with all related data
            const updatedTraining = await Training.findByPk(trainingId, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: TrainingDetail,
                        as: 'details'
                    },
                    {
                        model: ExternalFactor,
                        as: 'externalFactors'
                    }
                ]
            });

            return {
                success: true,
                data: updatedTraining
            }
        } catch (err) {
            throw err;
        }
    }

    static async updateTrainingStatus(trainingId, coachId, newStatus) {
        try {

            // Validar que el estado sea uno de los permitidos
            const allowedStatuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
            if (!newStatus || !allowedStatuses.includes(newStatus)) {
                throw new Error(`Status must be one of: ${allowedStatuses.join(', ')}`);
            }

            // Buscar el entrenamiento
            const training = await Training.findOne({
                where: {
                    id: trainingId,
                    coachId: coachId // Asegurarse de que solo el coach propietario pueda actualizarlo
                }
            });

            if (!training) {
                throw new Error('Training not found or you do not have permission to update it');
            }

            // Actualizar el estado
            training.status = newStatus;
            await training.save();

            return {
                success: true,
                data: training
            };
        } catch (err) {
            throw err;
        }
    }

    static async deleteTraining(trainingId, coachId) {
        try {

            const trainingExists = await Training.findOne({
                where: {
                    id: trainingId,
                    coachId: coachId,
                }
            });

            if (!trainingExists) {
                throw new Error('Training not found or you do not have permission to update it');
            }

            const training = await Training.findOne({
                where: {
                    id: trainingId,
                    coachId: coachId,
                }
            });

            if (!training) {
                throw new Error('Training not found or you do not have permission to update it');
            }

            // Delete training (cascading delete will handle related records)
            await training.destroy();

            return {
                success: true,
                data: {}
            };
        } catch (err) {
            throw err;
        }
    }

}

module.exports = TrainingService;
