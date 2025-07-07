const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomBoolean = (probability = 0.5) => Math.random() < probability;

const getRandomStartTime = () => {
    const hours = getRandomInt(6, 20);
    const minutes = getRandomInt(0, 59);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

const getRandomEndTime = () => {
    const hours = getRandomInt(6, 20);
    const minutes = getRandomInt(0, 59);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

module.exports = {
    getRandomInt,
    getRandomFloat,
    getRandomElement,
    getRandomBoolean,
    getRandomStartTime,
    getRandomEndTime
};