// Importaciones necesarias
const { getRandomInt, getRandomFloat, getRandomElement, getRandomBoolean, getRandomStartTime, getRandomEndTime } = require('../../../utils/random');
const { addDays, differenceInDays } = require('date-fns');
const { generateDateRange } = require('../../../utils/dates');
const { EXTERNAL_FACTOR_TYPES } = require('./constants.seederUtils');

// Constantes para datos de natación
const WEATHER_CONDITIONS = ['sunny', 'cloudy', 'partly-cloudy', 'rainy', 'windy'];

// Función para generar un entrenamiento con datos realistas
const generateTraining = (athlete, date, coachId, trainingIndex) => {
    // Determinar tipo de entrenamiento según día de la semana y progresión
    const dayOfWeek = date.getDay();
    let trainingType;

    // Patrón semanal realista de entrenamiento usando solo los tipos permitidos
    const validTypes = ['speed', 'resistance', 'mixed', 'other', 'technique'];
    switch (dayOfWeek) {
        case 1: // Lunes - técnica o resistencia
            trainingType = getRandomElement(['technique', 'resistance']);
            break;
        case 2: // Martes - velocidad
            trainingType = 'speed';
            break;
        case 3: // Miércoles - técnica o mixto
            trainingType = getRandomElement(['technique', 'mixed']);
            break;
        case 4: // Jueves - resistencia
            trainingType = 'resistance';
            break;
        case 5: // Viernes - velocidad o mixto
            trainingType = getRandomElement(['speed', 'mixed']);
            break;
        case 6: // Sábado - competición (other) o resistencia
            trainingType = trainingIndex % 4 === 0 ? 'other' : 'resistance';
            break;
        default: // Domingo - técnica o recuperación ligera (usando 'other' para recuperación)
            trainingType = getRandomElement(['technique', 'other']);
    }

    // Determinar duración según tipo de entrenamiento
    let durationMinutes;
    switch (trainingType) {
        case 'speed':
            durationMinutes = getRandomInt(45, 75);
            break;
        case 'resistance':
            durationMinutes = getRandomInt(75, 120);
            break;
        case 'technique':
            durationMinutes = getRandomInt(60, 90);
            break;
        case 'mixed':
            durationMinutes = getRandomInt(30, 60);
            break;
        case 'other':
            durationMinutes = getRandomInt(120, 180);
            break;
        default:
            durationMinutes = getRandomInt(60, 90);
    }

    // Calcular frecuencia cardíaca según intensidad del entrenamiento
    const intensity = trainingType === 'speed' || trainingType === 'resistance' ? 'high' :
        trainingType === 'technique' ? 'medium' :
            trainingType === 'mixed' ? 'low' : trainingType === 'other' ? 'low' : 'medium';

    // Calcular valores fisiológicos basados en la intensidad
    const heartRateRest = getRandomInt(55, 75);
    const heartRateDuring = intensity === 'high' ? getRandomInt(160, 190) :
        intensity === 'medium' ? getRandomInt(140, 170) :
            getRandomInt(120, 150);
    const heartRateAfter = intensity === 'high' ? getRandomInt(100, 130) :
        intensity === 'medium' ? getRandomInt(90, 120) :
            getRandomInt(80, 100);

    // Simular pérdida de peso durante el entrenamiento basado en la intensidad y duración
    const weightLoss = (intensity === 'high' ? 0.8 : intensity === 'medium' ? 0.5 : 0.3) *
        (durationMinutes / 60);
    const weightBefore = getRandomFloat(athlete.weight - 0.5, athlete.weight + 0.5, 1);
    const weightAfter = weightBefore - weightLoss;

    // Determinar si es entrenamiento al aire libre
    const isOutdoor = getRandomBoolean(0.4); // 40% probabilidad de ser al aire libre

    // Generar datos de condiciones ambientales si es al aire libre
    const temperature = isOutdoor ? getRandomInt(18, 32) : getRandomInt(25, 29);
    const humidity = isOutdoor ? getRandomInt(30, 90) : getRandomInt(40, 60);
    const weatherCondition = isOutdoor ? getRandomElement(WEATHER_CONDITIONS) : 'indoor';

    // Determinar equipamiento usado según tipo de entrenamiento
    let equipmentUsed = [];
    if (trainingType === 'technique') {
        if (getRandomBoolean(0.7)) equipmentUsed.push('paddles');
        if (getRandomBoolean(0.5)) equipmentUsed.push('pull buoy');
        if (getRandomBoolean(0.3)) equipmentUsed.push('snorkel');
    } else if (trainingType === 'speed') {
        if (getRandomBoolean(0.4)) equipmentUsed.push('fins');
        if (getRandomBoolean(0.3)) equipmentUsed.push('paddles');
    } else if (trainingType === 'resistance') {
        if (getRandomBoolean(0.6)) equipmentUsed.push('pull buoy');
        if (getRandomBoolean(0.4)) equipmentUsed.push('paddles');
        if (getRandomBoolean(0.3)) equipmentUsed.push('kickboard');
    } else if (trainingType === 'recovery') {
        if (getRandomBoolean(0.5)) equipmentUsed.push('kickboard');
        if (getRandomBoolean(0.3)) equipmentUsed.push('pull buoy');
    }
    equipmentUsed = equipmentUsed.length ? equipmentUsed.join(', ') : 'none';

    // Determinar patrón de respiración según estilo principal del atleta
    let breathingPattern;
    switch (athlete.specialtyStroke) {
        case 'freestyle':
            breathingPattern = getRandomElement(['cada 2 brazadas', 'cada 3 brazadas', 'bilateral']);
            break;
        case 'butterfly':
        case 'breaststroke':
            breathingPattern = 'cada brazada';
            break;
        case 'backstroke':
            breathingPattern = 'regular';
            break;
        default:
            breathingPattern = getRandomElement(['cada 2 brazadas', 'cada 3 brazadas']);
    }

    // Generar evaluación del estado físico
    const physicalStateRating = intensity === 'high' ? getRandomInt(6, 10) :
        intensity === 'medium' ? getRandomInt(7, 10) :
            getRandomInt(8, 10);

    // Posibilidad de reportar dolor según intensidad y duración
    const painProbability = (intensity === 'high' ? 0.2 : intensity === 'medium' ? 0.1 : 0.05) *
        (durationMinutes > 90 ? 1.5 : 1);
    const painReported = getRandomBoolean(painProbability) ?
        getRandomElement([
            'Dolor ligero en los hombros',
            'Dolor ligero en las rodillas',
            'Tensión en la columna baja',
            'Rígidez en los tobillos',
            'Dolor ligero en los codos'
        ]) : null;

    // Tipo de traje según si es competición o entrenamiento
    const swimsuitType = trainingType === 'other' ?
        getRandomElement(['jammer', 'traje de entrenamiento', 'briefs']) :
        'competición';

    return {
        date,
        trainingType,
        durationMinutes,
        isOutdoor,
        temperature,
        humidity,
        weatherCondition,
        athleteId: athlete.id,
        coachId,
        heartRateRest,
        heartRateDuring,
        heartRateAfter,
        weightBefore,
        weightAfter,
        breathingPattern,
        physicalStateRating,
        painReported,
        swimsuitType,
        startTime:getRandomStartTime(),
        endTime:getRandomEndTime(),
        equipmentUsed,
        notes: getRandomBoolean(0.3) ? `${trainingType.charAt(0).toUpperCase() + trainingType.slice(1)} session with focus on ${athlete.specialtyStroke}` : null
    };
};

const generateRealisticTime = (distance, swimStyle, athlete, trainingType, trainingDate) => {
    // Tiempos base por 100m para un nadador promedio (en segundos)
    const baseTimePer100m = {
        'freestyle': 75,
        'backstroke': 85,
        'breaststroke': 90,
        'butterfly': 80,
        'medley': 85
    };
    
    // Asegurarse de que swimStyle es válido, si no usar freestyle como fallback
    const style = baseTimePer100m[swimStyle] ? swimStyle : 'freestyle';

    // Factor de nivel del atleta (mejor tiempo = tiempo más bajo)
    let athleteLevelFactor;
    if (athlete.category === 'Senior') {
        athleteLevelFactor = getRandomFloat(0.85, 0.95); // 5-15% mejor que el promedio
    } else {
        athleteLevelFactor = getRandomFloat(0.9, 1.0); // 0-10% mejor que el promedio
    }

    // Ajuste si el estilo es la especialidad del atleta
    if (style === athlete.specialtyStroke) {
        athleteLevelFactor *= 0.95; // 5% adicional de mejora
    }

    // Ajuste por tipo de entrenamiento
    const trainingFactor =
        trainingType === 'speed' ? getRandomFloat(0.9, 0.95) : // Mejores tiempos en entrenamientos de velocidad
            trainingType === 'resistance' ? getRandomFloat(1.0, 1.1) : // Tiempos ligeramente más lentos en resistencia
                trainingType === 'technique' ? getRandomFloat(1.05, 1.15) : // Tiempos más lentos en técnica
                    trainingType === 'other' ? getRandomFloat(0.95, 1.0) : // Competición o eventos especiales - mejores tiempos
                        getRandomFloat(1.0, 1.05); // mixed o cualquier otro tipo

    // Calcular tiempo base para la distancia completa
    const baseTimeForDistance = (baseTimePer100m[style] * distance / 100);

    // Aplicar factores y añadir variación aleatoria (+/- 3%)
    const randomVariation = getRandomFloat(0.97, 1.03);

    // Calcular tiempo final y asegurarse de que sea un número válido
    const timeSeconds = baseTimeForDistance * athleteLevelFactor * trainingFactor * randomVariation;
    return isNaN(timeSeconds) ? baseTimePer100m[style] * distance / 100 : timeSeconds;
};

const generateWorkoutSeries = (training, athlete) => {
    const { trainingType } = training;
    const series = [];
    
    // Definir estilos de natación válidos para asegurar que nunca sean nulos
    const validSwimStyles = ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'medley'];
    
    // Función auxiliar para asegurar que el estilo sea válido
    const ensureValidStyle = (style) => {
        return validSwimStyles.includes(style) ? style : 'freestyle';
    };

    // Usar el atleta directamente
    const athleteData = athlete;

    // Determinar estructura de entrenamiento según tipo
    switch (trainingType) {
        case 'speed':
            // Entrenamiento de velocidad: series cortas, alta intensidad
            series.push(
                // Calentamiento
                { distance: 400, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 60, intensity: 'low' },
                // Técnica
                { distance: 200, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 2, rest: 45, intensity: 'medium' },
                // Series principales de velocidad
                { distance: 50, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 8, rest: 30, intensity: 'high' },
                { distance: 100, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 4, rest: 60, intensity: 'high' },
                // Enfriamiento
                { distance: 200, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 0, intensity: 'low' }
            );
            break;

        case 'resistance':
            // Entrenamiento de resistencia: series largas, intensidad media-alta
            series.push(
                // Calentamiento
                { distance: 400, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 60, intensity: 'low' },
                // Series principales
                { distance: 400, swimStyle: ensureValidStyle('freestyle'), repetitions: 4, rest: 45, intensity: 'medium' },
                { distance: 200, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 4, rest: 30, intensity: 'high' },
                // Series de resistencia
                { distance: 800, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 120, intensity: 'medium' },
                // Enfriamiento
                { distance: 200, swimStyle: ensureValidStyle('medley'), repetitions: 1, rest: 0, intensity: 'low' }
            );
            break;

        case 'technique':
            // Entrenamiento técnico: enfoque en técnica, intensidad baja-media
            series.push(
                // Calentamiento
                { distance: 300, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 60, intensity: 'low' },
                // Ejercicios técnicos
                { distance: 50, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 8, rest: 20, intensity: 'low' },
                { distance: 100, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 4, rest: 30, intensity: 'medium' },
                // Trabajo técnico combinado
                { distance: 200, swimStyle: ensureValidStyle('medley'), repetitions: 3, rest: 45, intensity: 'medium' },
                // Enfriamiento
                { distance: 200, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 0, intensity: 'low' }
            );
            break;

        case 'recovery':
            // Entrenamiento de recuperación: baja intensidad, volumen moderado
            series.push(
                // Nado continuo suave
                { distance: 400, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 30, intensity: 'low' },
                // Técnica relajada
                { distance: 100, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 3, rest: 30, intensity: 'low' },
                // Nado variado
                { distance: 200, swimStyle: ensureValidStyle('medley'), repetitions: 2, rest: 45, intensity: 'low' },
                // Enfriamiento
                { distance: 200, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 0, intensity: 'low' }
            );
            break;

        case 'competition':
            // Simulación de competición: alta intensidad, series específicas
            series.push(
                // Calentamiento completo
                { distance: 600, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 60, intensity: 'low' },
                // Activación
                { distance: 50, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 4, rest: 30, intensity: 'high' },
                // Simulación de prueba principal
                { distance: athleteData.preferredDistance || 100, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 1, rest: 300, intensity: 'max' },
                // Series de velocidad post-competición
                { distance: 50, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 2, rest: 60, intensity: 'high' },
                // Enfriamiento
                { distance: 400, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 0, intensity: 'low' }
            );
            break;

        default: // mixed
            // Entrenamiento mixto: combinación de elementos
            series.push(
                // Calentamiento
                { distance: 400, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 60, intensity: 'low' },
                // Series variadas
                { distance: 100, swimStyle: ensureValidStyle('freestyle'), repetitions: 4, rest: 20, intensity: 'medium' },
                { distance: 100, swimStyle: ensureValidStyle(athleteData.specialtyStroke), repetitions: 4, rest: 30, intensity: 'high' },
                { distance: 200, swimStyle: ensureValidStyle('medley'), repetitions: 2, rest: 45, intensity: 'medium' },
                // Enfriamiento
                { distance: 200, swimStyle: ensureValidStyle('freestyle'), repetitions: 1, rest: 0, intensity: 'low' }
            );
    }

    return series;
};

// Generar factores externos que afectan el rendimiento
const generateExternalFactors = (athletes, trainings) => {
    const factors = [];

    // Generar factores para cada atleta
    for (const athlete of athletes) {
        // Determinar cuántos factores tendrá cada atleta (1-3)
        const numFactors = getRandomInt(1, 3);

        for (let i = 0; i < numFactors; i++) {
            // Seleccionar tipo de factor aleatorio
            const factorType = getRandomElement(EXTERNAL_FACTOR_TYPES);

            // Configurar detalles según el tipo de factor
            let description, severity, performanceImpact, notes;
            let dateRange;

            switch (factorType) {
                case 'injury':
                    const injuries = [
                        { desc: 'Enrojecimiento en hombros', sev: getRandomInt(5, 8), impact: getRandomInt(-8, -4), notes: 'Necesario reducir la intensidad del entrenamiento' },
                        { desc: 'Dolor en rodillas', sev: getRandomInt(4, 7), impact: getRandomInt(-7, -3), notes: 'Movimientos limitados de las piernas' },
                        { desc: 'Tensión en la columna baja', sev: getRandomInt(3, 6), impact: getRandomInt(-6, -2), notes: 'Posición corporal afectada en el agua' },
                        { desc: 'Inflamación en las muñecas', sev: getRandomInt(2, 5), impact: getRandomInt(-5, -2), notes: 'Potencia reducida del brazo' }
                    ];
                    const injury = getRandomElement(injuries);
                    description = injury.desc;
                    severity = injury.sev;
                    performanceImpact = injury.impact;
                    notes = injury.notes;
                    dateRange = generateDateRange(5, 25, getRandomInt(5, 14)); // Duración de 5-14 días
                    break;

                case 'illness':
                    const illnesses = [
                        { desc: 'Resfriado común', sev: getRandomInt(3, 6), impact: getRandomInt(-6, -2), notes: 'Limitaciones respiratorias' },
                        { desc: 'Gripe', sev: getRandomInt(6, 9), impact: getRandomInt(-9, -5), notes: 'Faltas de entrenamiento' },
                        { desc: 'Virus estomacal', sev: getRandomInt(5, 8), impact: getRandomInt(-8, -4), notes: 'Problemas de hidratación' }
                    ];
                    const illness = getRandomElement(illnesses);
                    description = illness.desc;
                    severity = illness.sev;
                    performanceImpact = illness.impact;
                    notes = illness.notes;
                    dateRange = generateDateRange(3, 20, getRandomInt(3, 10)); // Duración de 3-10 días
                    break;

                case 'nutrition':
                    const nutritionFactors = [
                        { desc: 'Plan nutricional mejorado', sev: getRandomInt(6, 9), impact: getRandomInt(4, 8), notes: 'Mayor ingesta de proteínas y mejor hidratación' },
                        { desc: 'Nutrición pre-competición', sev: getRandomInt(7, 10), impact: getRandomInt(5, 9), notes: 'Carga de carbohidratos optimizada' },
                        { desc: 'Cambio en estrategia de hidratación', sev: getRandomInt(5, 8), impact: getRandomInt(3, 7), notes: 'Mejor balance de electrolítos' },
                        { desc: 'Deficiencia nutricional', sev: getRandomInt(4, 7), impact: getRandomInt(-7, -3), notes: 'Niveles bajos de hierro detectados' }
                    ];
                    const nutrition = getRandomElement(nutritionFactors);
                    description = nutrition.desc;
                    severity = nutrition.sev;
                    performanceImpact = nutrition.impact;
                    notes = nutrition.notes;
                    dateRange = generateDateRange(2, 28, performanceImpact > 0 ? null : getRandomInt(7, 21)); // Si es positivo, sigue en curso
                    break;

                case 'sleep':
                    const sleepFactors = [
                        { desc: 'Disturbio del sueño por exámenes', sev: getRandomInt(6, 9), impact: getRandomInt(-8, -4), notes: 'Promedio de solo 5-6 horas de sueño' },
                        { desc: 'Rutina de sueño mejorada', sev: getRandomInt(7, 9), impact: getRandomInt(4, 8), notes: 'Consistente 8+ horas con mejor calidad' },
                        { desc: 'Fatiga por viaje', sev: getRandomInt(5, 8), impact: getRandomInt(-7, -3), notes: 'Ritmo circadiano alterado' }
                    ];
                    const sleep = getRandomElement(sleepFactors);
                    description = sleep.desc;
                    severity = sleep.sev;
                    performanceImpact = sleep.impact;
                    notes = sleep.notes;
                    dateRange = generateDateRange(1, 25, performanceImpact < 0 ? getRandomInt(5, 14) : null);
                    break;

                case 'stress':
                    const stressFactors = [
                        { desc: 'Presión académica', sev: getRandomInt(5, 9), impact: getRandomInt(-8, -3), notes: 'Período de exámenes finales' },
                        { desc: 'Ansiedad por competencias', sev: getRandomInt(6, 9), impact: getRandomInt(-7, -2), notes: 'Pre-campeonato nacional' },
                        { desc: 'Problemas personales', sev: getRandomInt(7, 10), impact: getRandomInt(-9, -4), notes: 'Situación familiar afectando el enfoque' }
                    ];
                    const stress = getRandomElement(stressFactors);
                    description = stress.desc;
                    severity = stress.sev;
                    performanceImpact = stress.impact;
                    notes = stress.notes;
                    dateRange = generateDateRange(1, 20, getRandomInt(7, 21));
                    break;

                case 'travel':
                    const travelFactors = [
                        { desc: 'Viaje por competencias', sev: getRandomInt(4, 7), impact: getRandomInt(-6, -2), notes: 'Rutina de entrenamiento disruptiva' },
                        { desc: 'Campamento de entrenamiento de altitud', sev: getRandomInt(8, 10), impact: getRandomInt(6, 10), notes: 'Adaptaciones fisiológicas' },
                        { desc: 'Viaje de larga distancia', sev: getRandomInt(5, 8), impact: getRandomInt(-7, -3), notes: 'Recuperación afectada por fatiga de viaje' }
                    ];
                    const travel = getRandomElement(travelFactors);
                    description = travel.desc;
                    severity = travel.sev;
                    performanceImpact = travel.impact;
                    notes = travel.notes;
                    dateRange = generateDateRange(3, 25, getRandomInt(3, 10));
                    break;

                case 'medication':
                    const medicationFactors = [
                        { desc: 'Medicamento anti-inflamatorio para hombros', sev: getRandomInt(3, 6), impact: getRandomInt(2, 5), notes: 'Prescrito por médico deportivo' },
                        { desc: 'Ciclo antibiótico', sev: getRandomInt(5, 8), impact: getRandomInt(-6, -2), notes: 'Efectos secundarios afectando energía' },
                        { desc: 'Medicamento por alergia', sev: getRandomInt(2, 5), impact: getRandomInt(-4, 0), notes: 'Somnolencia leve como efecto secundario' }
                    ];
                    const medication = getRandomElement(medicationFactors);
                    description = medication.desc;
                    severity = medication.sev;
                    performanceImpact = medication.impact;
                    notes = medication.notes;
                    dateRange = generateDateRange(2, 20, getRandomInt(5, 14));
                    break;

                case 'weather':
                    const weatherFactors = [
                        { desc: 'Calentamiento', sev: getRandomInt(6, 9), impact: getRandomInt(-8, -3), notes: 'Entrenamiento en exceso de calor' },
                        { desc: 'Adaptación al clima frío', sev: getRandomInt(5, 8), impact: getRandomInt(-5, 5), notes: 'Ajustando a la piscina al aire libre en invierno' },
                        { desc: 'Aumento de humedad', sev: getRandomInt(4, 7), impact: getRandomInt(-6, -2), notes: 'Afectando el patrón de respiración' }
                    ];
                    const weather = getRandomElement(weatherFactors);
                    description = weather.desc;
                    severity = weather.sev;
                    performanceImpact = weather.impact;
                    notes = weather.notes;
                    dateRange = generateDateRange(1, 15, getRandomInt(3, 10));
                    break;

                default:
                    description = 'Misceláneo';
                    severity = getRandomInt(3, 8);
                    performanceImpact = getRandomInt(-5, 5);
                    notes = 'Efectos variados en el rendimiento';
                    dateRange = generateDateRange(1, 25, getRandomInt(5, 15));
            }

            // Buscar un entrenamiento que coincida con el período del factor
            let matchingTrainingId = null;
            if (dateRange && dateRange.startDate && dateRange.endDate && trainings) {
                const matchingTraining = trainings.find(t => 
                    t.athleteId === athlete.id && 
                    new Date(t.date) >= new Date(dateRange.startDate) && 
                    new Date(t.date) <= new Date(dateRange.endDate)
                );
                
                if (matchingTraining) {
                    matchingTrainingId = matchingTraining.id;
                }
            }

            // Añadir factor externo con validación de datos
            factors.push({
                athleteId: athlete.id,
                type: factorType || 'other',
                description: description || 'Factor no especificado',
                severity: isNaN(severity) ? 5 : severity,
                performanceImpact: isNaN(performanceImpact) ? 0 : performanceImpact,
                startDate: dateRange && dateRange.startDate ? dateRange.startDate : new Date(),
                endDate: dateRange && dateRange.endDate ? dateRange.endDate : new Date(new Date().setDate(new Date().getDate() + 7)),
                trainingId: matchingTrainingId || null,
                notes: notes || 'Sin notas adicionales'
            });
        }
    }

    return factors;
};

module.exports = {
    generateTraining,
    generateRealisticTime,
    generateWorkoutSeries,
    generateExternalFactors
}