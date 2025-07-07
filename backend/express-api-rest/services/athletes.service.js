const { Op, fn, col, literal } = require('sequelize');
const { User, Athlete } = require('../models/index');

class AthleteService {

    static async getAthletes(coachId) {
        try {
            if (!coachId) {
                throw new Error('Coach ID is required');
            }

            const coachExists = await User.findByPk(coachId);
            if (!coachExists) {
                throw new Error('Coach not found');
            }

            const athletes = await Athlete.findAll({
                where: { coachId },
                order: [['lastName', 'ASC'], ['firstName', 'ASC']]
            });

            return athletes;
        } catch (err) {
            throw err;
        }
    }

    static async getAthlete(athleteId, coachId) {
        try {
            if (!athleteId) {
                throw new Error('Athlete ID is required');
            }

            if (!coachId) {
                throw new Error('Coach ID is required');
            }

            const athlete = await Athlete.findOne({
                where: {
                    id: athleteId,
                    coachId: coachId // Asegurar que el atleta pertenece al entrenador
                }
            });

            if (!athlete) {
                throw new Error('Athlete not found or you do not have permission to view it');
            }

            return athlete;
        } catch (err) {
            throw err;
        }
    }

    static async createAthlete(coachId, athleteData) {
        try {

            const coachExists = await User.findByPk(coachId);
            if (!coachExists) {
                throw new Error('Coach not found');
            }

            const athlete = await Athlete.create({
                coachId,
                ...athleteData
            });

            return athlete;
        } catch (err) {
            throw err;
        }
    }

    static async updateAthlete(athleteId, athleteData, coachId) {
        try {
            if (!athleteId) {
                throw new Error('Athlete ID is required');
            }

            if (!athleteData) {
                throw new Error('Athlete data is required');
            }

            let athlete = await Athlete.findOne({
                where: {
                    id: athleteId,
                    coachId,
                }
            });

            if (!athlete) {
                throw new Error('Athlete not found');
            }

            // Update athlete
            await athlete.update(athleteData);

            // Get updated athlete
            athlete = await Athlete.findByPk(athleteId);

            return athlete;
        } catch (err) {
            throw err;
        }
    }

    static async deleteAthlete(athleteId, coachId) {
        try {
            const athlete = await Athlete.findOne({
                where: {
                    id: athleteId,
                    coachId
                }
            });

            if (!athlete) {
                throw new Error('Athlete not found');
            }

            // Delete athlete (cascading delete will handle related records)
            await athlete.destroy();

            return {};
        } catch (err) {
            throw err;
        }
    }

}

module.exports = AthleteService;
