import apiClient from './api';

// Interfaces para las respuestas de la API
export interface DashboardMetrics {
  totalAthletes: number;
  totalTrainings: number;
  totalIncidents: number;
  trainingsByStatus: Record<string, number>;
  incidentsByType: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Servicio para el dashboard
const dashboardService = {
  // Obtener estadísticas básicas del dashboard
  getBasicMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiClient.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
    return response.data.data;
  },

  // Obtener estadísticas detalladas del dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data.data;
  },
};

export default dashboardService;
