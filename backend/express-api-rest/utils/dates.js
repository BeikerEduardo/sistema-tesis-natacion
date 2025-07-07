// Importar funciones necesarias
const { getRandomInt } = require('./random');

// Funciones auxiliares para manipulación de fechas
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const subDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
};

// Función para generar fechas de inicio y fin dentro del último mes
const generateDateRange = (minDaysAgo, maxDaysAgo, durationDays) => {
    const currentDate = new Date();
    const startDaysAgo = getRandomInt(minDaysAgo, maxDaysAgo);
    const startDate = subDays(currentDate, startDaysAgo);
    const endDate = durationDays ? addDays(startDate, durationDays) : null;
    return { startDate, endDate };
};

module.exports = {
    addDays,
    subDays,
    generateDateRange
};