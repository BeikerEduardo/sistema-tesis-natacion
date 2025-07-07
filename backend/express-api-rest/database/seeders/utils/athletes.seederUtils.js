const { Athlete } = require('../../../models');

const createAthletes = async (athletesData) => {
    try {
        const athletes = await Athlete.bulkCreate(athletesData);
        console.log(`${athletes.length} atletas creados`);
        return athletes;

    } catch (error) {
        console.error('Error creating athletes:', error);
        throw error;
    }
}

module.exports = {
    createAthletes
};