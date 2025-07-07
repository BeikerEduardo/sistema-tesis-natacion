import apiClient from '../api';
import { AxiosResponse } from 'axios';
import { TimeEvolutionData, PerformanceAlert, TimeSeriesMetric, EfficiencyData, ConsistencyData, LoadVolumeData, GeneralConsistencyData } from '@/types/analytics';

/**
 * Servicio para las analíticas de rendimiento
 */
class AnalyticsService {
  /**
   * Obtiene la evolución de tiempo para un atleta, distancia y estilo específicos
   */
  async getTimeEvolution(
    athleteId: number,
    distance: number,
    swimStyle: string,
    months: number = 3
  ): Promise<TimeEvolutionData[]> {
    const response: AxiosResponse<{ success: boolean; data: TimeEvolutionData[] }> = 
      await apiClient.get(`/analytics/athlete/${athleteId}/time-evolution`, {
        params: { distance, swimStyle, months }
      });
    return response.data.data;
  }

  /**
   * Obtiene las alertas de rendimiento para un atleta
   */
  async getPerformanceAlerts(athleteId: number): Promise<PerformanceAlert[]> {
    const response: AxiosResponse<{ success: boolean; data: PerformanceAlert[] }> = 
      await apiClient.get(`/analytics/athlete/${athleteId}/performance-alerts`);
    return response.data.data;
  }

  /**
   * Obtiene las métricas de series temporales para un atleta
   */
  async getTimeSeriesMetrics(athleteId: number): Promise<TimeSeriesMetric[]> {
    const response: AxiosResponse<{ success: boolean; data: TimeSeriesMetric[] }> = 
      await apiClient.get(`/analytics/athlete/${athleteId}/time-series-metrics`);
    return response.data.data;
  }

  /**
   * Obtiene la eficiencia por series para un atleta
   */
  async getEfficiencyBySeries(athleteId: number): Promise<EfficiencyData[]> {
    const response: AxiosResponse<{ success: boolean; data: EfficiencyData[] }> = 
      await apiClient.get(`/analytics/athlete/${athleteId}/efficiency`);
    return response.data.data;
  }

  /**
   * Obtiene la consistencia intra-sesión para un atleta
   */
  async getIntraSessionConsistency(athleteId: number): Promise<ConsistencyData[]> {
    const response: AxiosResponse<{ success: boolean; data: ConsistencyData[] }> = 
      await apiClient.get(`/analytics/athlete/${athleteId}/consistency`);
    return response.data.data;
  }

  /**
   * Obtiene la carga y volumen para un atleta
   */
  async getLoadAndVolume(athleteId: number): Promise<LoadVolumeData> {
    const response: AxiosResponse<{ success: boolean; data: LoadVolumeData }> = 
      await apiClient.get(`/analytics/athlete/${athleteId}/total-load`);
    return response.data.data;
  }

  /**
   * Obtiene la consistencia general para un atleta
   */
  async getGeneralConsistency(athleteId: number): Promise<GeneralConsistencyData> {
    const response: AxiosResponse<{ success: boolean; data: GeneralConsistencyData }> = 
      await apiClient.get(`/analytics/athlete/${athleteId}/general-consistency`);
    return response.data.data;
  }
}

export default new AnalyticsService();
