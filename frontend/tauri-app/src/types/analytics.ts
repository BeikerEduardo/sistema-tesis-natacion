
/**
 * Interfaz para los datos de evolución de tiempo
 */
export interface TimeEvolutionData {
  date: string;
  time: number;
  distance: number;
  swimStyle: string;
}

/**
 * Interfaz para las alertas de rendimiento
 */
export interface PerformanceAlert {
  id: number;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}

/**
 * Interfaz para las métricas de series temporales
 */
export interface TimeSeriesMetric {
  date: string;
  weight: number;
  hrRest: number;
  hrDuring: number;
  hrAfter: number;
  physicalState: number;
}

/**
 * Interfaz para la eficiencia por series
 */
export interface EfficiencyData {
  series: number;
  avgEfficiency: number;
}

/**
 * Interfaz para la consistencia intra-sesión
 */
export interface ConsistencyData {
  series: number;
  stdDev: number;
}

/**
 * Interfaz para la carga y volumen
 */
export interface LoadVolumeData {
  weeklyDuration: Array<{
    week: string;
    minutes: number;
  }>;
  weeklyDistance: Array<{
    week: string;
    meters: number;
  }>;
}

/**
 * Interfaz para la consistencia general
 */
export interface GeneralConsistencyData {
  coefficient: number;
  weeklyData: Array<{
    week: string;
    sessions: number;
  }>;
}