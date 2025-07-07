import { ExternalFactor, ExternalFactorCreate, ExternalFactorUpdate } from '@/types/externalFactor';
import apiClient from '../api';
import { AxiosResponse } from 'axios';


/**
 * Servicio para la gestión de factores externos
 */
class ExternalFactorsService {
  /**
   * Obtiene todos los factores externos de un atleta
   */
  async getAthleteExternalFactors(athleteId: number): Promise<ExternalFactor[]> {
    const response: AxiosResponse<{ success: boolean; data: ExternalFactor[] }> = 
      await apiClient.get(`/external-factors/athlete/${athleteId}`);
    return response.data.data;
  }

  /**
   * Obtiene los factores externos asociados a un entrenamiento
   */
  async getTrainingExternalFactors(trainingId: number): Promise<ExternalFactor[]> {
    const response: AxiosResponse<{ success: boolean; data: ExternalFactor[] }> = 
      await apiClient.get(`/external-factors/training/${trainingId}`);
    return response.data.data;
  }

  /**
   * Obtiene un factor externo por su ID
   */
  async getExternalFactor(factorId: number): Promise<ExternalFactor> {
    const response: AxiosResponse<{ success: boolean; data: ExternalFactor }> = 
      await apiClient.get(`/external-factors/${factorId}`);
    return response.data.data;
  }

  /**
   * Crea un nuevo factor externo
   */
  async createExternalFactor(factorData: ExternalFactorCreate): Promise<ExternalFactorCreate> {
    const response: AxiosResponse<{ success: boolean; data: ExternalFactor }> = 
      await apiClient.post('/external-factors', factorData);
    return response.data.data;
  }

  /**
   * Actualiza un factor externo existente
   */
  async updateExternalFactor(factorId: number, factorData: ExternalFactorUpdate): Promise<ExternalFactorUpdate> {
    const response: AxiosResponse<{ success: boolean; data: ExternalFactorUpdate }> = 
      await apiClient.put(`/external-factors/${factorId}`, factorData);
    return response.data.data;
  }

  /**
   * Elimina un factor externo
   */
  async deleteExternalFactor(factorId: number): Promise<void> {
    await apiClient.delete(`/external-factors/${factorId}`);
  }
}

export default new ExternalFactorsService();
