// Exportaciones de servicios
import apiClient from './api';
import analyticsService from './analytics/analyticsService';
import athletesService from './athletes/athletesService';
import trainingsService from './trainings/trainingsService';
import externalFactorsService from './externalFactors/externalFactorsService';
import authService from './auth/authService';
import dashboardService from './dashboardService';

// Re-exportaciones para facilitar el uso
export { 
  apiClient,
  analyticsService,
  athletesService,
  trainingsService,
  externalFactorsService,
  authService,
  dashboardService
};

// Exportación de tipos
export type { 
  TimeEvolutionData,
  PerformanceAlert,
  TimeSeriesMetric,
  EfficiencyData,
  ConsistencyData,
  LoadVolumeData,
  GeneralConsistencyData
} from '../types/analytics';

export type {
  Athlete,
  AthleteCreate,
  AthleteUpdate,
} from '../types/athlete';

export type {
  Training,
  TrainingCreate,
  TrainingUpdate,
} from '../types/training';

export type {
  ExternalFactor,
  ExternalFactorCreate,
  ExternalFactorUpdate,
} from '../types/externalFactor';

export type {
  DashboardMetrics
} from './dashboardService';

export type {
  User,
  UserCreate,
  UserUpdate,
} from '../types/user';
