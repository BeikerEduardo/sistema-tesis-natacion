const { ExternalFactor, Athlete, Training } = require('../models');

class ExternalFactorsService {
    static async getExternalFactors(coachId) {
        try {
            // Filtrar por coach (solo factores de atletas que entrena)
            const externalFactors = await ExternalFactor.findAll({
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        where: { coachId },
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: Training,
                        as: 'training',
                        attributes: ['id', 'date', 'title', 'trainingType']
                    }
                ]
            });

            return {
                success: true,
                count: externalFactors.length,
                data: externalFactors
            };
        } catch (err) {
            throw err;
        }
    }

    static async getExternalFactor(externalFactorId, coachId) {
        try {
            const externalFactor = await ExternalFactor.findByPk(externalFactorId, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: Training,
                        as: 'training',
                        attributes: ['id', 'date', 'title', 'trainingType']
                    }
                ]
            });

            // Verificar que el factor existe
            if (!externalFactor) {
                throw Error("Factor externo no encontrado");
            }

            // Verificar que el atleta pertenece al entrenador
            if (externalFactor.athlete && externalFactor.athlete.coachId !== coachId) {
                throw Error("No autorizado para acceder a este factor externo");
            }

            return {
                success: true,
                data: externalFactor
            };
        } catch (err) {
            throw err;
        }
    }
    static async createExternalFactor(coachId, externalFactorData) {
        try {
            // Verificar que se proporcionaron los campos requeridos
            if (!externalFactorData.athleteId) {
                throw Error("El ID del atleta es obligatorio");
            }

            if (!externalFactorData.factorType) {
                throw Error("El tipo de factor es obligatorio");
            }

            if (!externalFactorData.description) {
                throw Error("La descripción es obligatoria");
            }

            if (!externalFactorData.startDate) {
                throw Error("La fecha de inicio es obligatoria");
            }

            // Verificar que el atleta pertenece al entrenador
            const athlete = await Athlete.findOne({
                where: {
                    id: externalFactorData.athleteId,
                    coachId
                }
            });

            if (!athlete) {
                throw Error("Atleta no encontrado o no pertenece a este entrenador");
            }

            // Si se proporciona un ID de entrenamiento, verificar que existe
            if (externalFactorData.trainingId) {
                const training = await Training.findOne({
                    where: {
                        id: externalFactorData.trainingId,
                        athleteId: externalFactorData.athleteId
                    }
                });

                if (!training) {
                    throw Error("Entrenamiento no encontrado o no pertenece a este atleta");
                }
            }

            // Crear el factor externo
            const externalFactor = await ExternalFactor.create(externalFactorData);

            // Obtener el factor con relaciones
            const completeExternalFactor = await ExternalFactor.findByPk(externalFactor.id, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: Training,
                        as: 'training',
                        attributes: ['id', 'date', 'title', 'trainingType']
                    }
                ]
            });

            return {
                success: true,
                data: completeExternalFactor
            };
        } catch (err) {
            throw err;
        }
    }

    static async updateExternalFactor(externalFactorId, coachId, externalFactorData) {
        try {
            if (!externalFactorId) {
                throw Error("External factor ID is required");
            }

            // Buscar el factor externo
            let externalFactor = await ExternalFactor.findByPk(externalFactorId, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category', 'coachId']
                    }
                ]
            });

            // Verificar que el factor existe
            if (!externalFactor) {
                throw Error("External factor not found");
            }

            // Verificar que el atleta pertenece al entrenador
            if (externalFactor.athlete && externalFactor.athlete.coachId !== coachId) {
                throw Error("No autorizado para modificar este factor externo");
            }

            // Si se cambia el atleta, verificar que pertenece al entrenador
            if (externalFactorData.athleteId && externalFactorData.athleteId !== externalFactor.athleteId) {
                const athlete = await Athlete.findOne({
                    where: {
                        id: externalFactorData.athleteId,
                        coachId
                    }
                });

                if (!athlete) {
                    throw Error("Atleta no encontrado o no pertenece a este entrenador");
                }
            }

            // Si se cambia el entrenamiento, verificar que existe
            if (externalFactorData.trainingId && externalFactorData.trainingId !== externalFactor.trainingId) {
                const training = await Training.findOne({
                    where: {
                        id: externalFactorData.trainingId,
                        athleteId: externalFactorData.athleteId || externalFactor.athleteId
                    }
                });

                if (!training) {
                    throw Error("Entrenamiento no encontrado o no pertenece a este atleta");
                }
            }

            // Actualizar el factor externo
            await externalFactor.update(externalFactorData);

            // Obtener el factor actualizado con relaciones
            const updatedExternalFactor = await ExternalFactor.findByPk(externalFactorId, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: Training,
                        as: 'training',
                        attributes: ['id', 'date', 'title', 'trainingType']
                    }
                ]
            });

            return {
                success: true,
                data: updatedExternalFactor
            };
        } catch (err) {
            throw err;
        }
    }

    static async deleteExternalFactor(externalFactorId, coachId) {
        try {
            // Buscar el factor externo
            const externalFactor = await ExternalFactor.findByPk(externalFactorId, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'coachId']
                    }
                ]
            });

            // Verificar que el factor existe
            if (!externalFactor) {
                throw Error("Factor externo no encontrado");
            }

            // Verificar que el atleta pertenece al entrenador
            if (externalFactor.athlete && externalFactor.athlete.coachId !== coachId) {
                throw Error("No autorizado para eliminar este factor externo");
            }

            // Eliminar el factor externo
            await externalFactor.destroy();

            return {
                success: true,
                data: {}
            };
        } catch (err) {
            throw err;
        }
    }

    static async getAthleteExternalFactors(athleteId, coachId) {
        try {
            // Verificar que el atleta pertenece al entrenador
            const athlete = await Athlete.findOne({
                where: {
                    id: athleteId,
                    coachId
                }
            });

            if (!athlete) {
                throw Error("Atleta no encontrado o no pertenece a este entrenador");
            }

            // Obtener los factores externos del atleta
            const externalFactors = await ExternalFactor.findAll({
                where: { athleteId },
                include: [
                    {
                        model: Training,
                        as: 'training',
                        attributes: ['id', 'date', 'title', 'trainingType']
                    }
                ],
                order: [['startDate', 'DESC']]
            });

            return {
                success: true,
                count: externalFactors.length,
                data: externalFactors
            };
        } catch (err) {
            throw err;
        }
    }
    static async createAthleteExternalFactor(athleteId, coachId, externalFactorData) {
        try {

            // Verificar que el atleta pertenece al entrenador
            const athlete = await Athlete.findOne({
                where: {
                    id: athleteId,
                    coachId
                }
            });

            if (!athlete) {
                throw Error("Atleta no encontrado o no pertenece a este entrenador");
            }

            // Crear el factor externo con el ID del atleta
            const externalFactor = await ExternalFactor.create({
                ...externalFactorData,
                athleteId
            });

            // Obtener el factor con relaciones
            const completeExternalFactor = await ExternalFactor.findByPk(externalFactor.id, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: Training,
                        as: 'training',
                        attributes: ['id', 'date', 'title', 'trainingType']
                    }
                ]
            });

            return {
                success: true,
                data: completeExternalFactor
            };
        } catch (err) {
            throw err;
        }
    }

    static async getTrainingExternalFactors(trainingId, coachId) {
        try {
            // Verificar que el entrenamiento pertenece a un atleta del entrenador
            const training = await Training.findOne({
                where: { id: trainingId },
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        where: { coachId }
                    }
                ]
            });

            if (!training) {
                throw Error("Entrenamiento no encontrado o no pertenece a un atleta de este entrenador");
            }

            // Obtener los factores externos del entrenamiento
            const externalFactors = await ExternalFactor.findAll({
                where: { trainingId },
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    }
                ],
                order: [['startDate', 'DESC']]
            });

            return {
                success: true,
                count: externalFactors.length,
                data: externalFactors
            };
        } catch (err) {
            throw err;
        }
    }

    static async createTrainingExternalFactor(trainingId, coachId, externalFactorData) {
        try {


            // Verificar que el entrenamiento pertenece a un atleta del entrenador
            const training = await Training.findOne({
                where: { id: trainingId },
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        where: { coachId }
                    }
                ]
            });

            if (!training) {
                throw Error("Entrenamiento no encontrado o no pertenece a un atleta de este entrenador");
            }

            // Crear el factor externo con el ID del entrenamiento y del atleta
            const externalFactor = await ExternalFactor.create({
                ...externalFactorData,
                trainingId,
                athleteId: training.athleteId
            });

            // Obtener el factor con relaciones
            const completeExternalFactor = await ExternalFactor.findByPk(externalFactor.id, {
                include: [
                    {
                        model: Athlete,
                        as: 'athlete',
                        attributes: ['id', 'firstName', 'lastName', 'category']
                    },
                    {
                        model: Training,
                        as: 'training',
                        attributes: ['id', 'date', 'title', 'trainingType']
                    }
                ]
            });

            return {
                success: true,
                data: completeExternalFactor
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ExternalFactorsService;
