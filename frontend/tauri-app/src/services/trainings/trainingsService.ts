import { Training, TrainingCreate, TrainingUpdate, TrainingStatus } from '@/types/training';
import apiClient from '../api';
import { AxiosResponse } from 'axios';
import { TrainingDetail, TrainingDetailCreate, TrainingDetailUpdate } from '@/types/trainingDetail';

/**
 * Servicio para la gestión de entrenamientos
 */
class TrainingsService {
  /**
   * Obtiene todos los entrenamientos con paginación opcional
   */
  async getAllTrainings(page: number = 1, limit: number = 10): Promise<Training[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: Training[]; pagination?: { total: number; totalPages: number } }> = 
        await apiClient.get(`/trainings`, {
          params: { page, limit }
        });
      return response.data.data;
    } catch (error: any) {
      console.error('Error al obtener todos los entrenamientos:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los entrenamientos de un atleta
   */
  async getAthleteTrainings(athleteId: number): Promise<Training[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: Training[] }> = 
        await apiClient.get(`/trainings/athlete/${athleteId}`);
      return response.data.data;
    } catch (error: any) {
      // Si la ruta no existe (404), intentamos usar una ruta alternativa
      if (error?.response?.status === 404) {
        console.warn('Ruta /trainings/athlete/:id no encontrada, intentando ruta alternativa');
        try {
          // Intentar obtener todos los entrenamientos y filtrar por athleteId
          const allTrainings = await this.getAllTrainings();
          return allTrainings.filter(training => training.athleteId === athleteId);
        } catch (fallbackError) {
          console.error('Error en la ruta alternativa:', fallbackError);
          throw fallbackError;
        }
      }
      throw error;
    }
  }

  /**
   * Obtiene un entrenamiento por su ID
   */
  async getTraining(trainingId: number): Promise<Training> {
    const response: AxiosResponse<{ success: boolean; data: Training }> = 
      await apiClient.get(`/trainings/${trainingId}`);
    return response.data.data;
  }

  /**
   * Crea un nuevo entrenamiento
   */
  async createTraining(trainingData: TrainingCreate): Promise<TrainingCreate> {
    const response: AxiosResponse<{ success: boolean; data: TrainingCreate }> = 
      await apiClient.post('/trainings', trainingData);
    return response.data.data;
  }

  /**
   * Actualiza un entrenamiento existente
   */
  async updateTraining(trainingId: number, trainingData: TrainingUpdate): Promise<Training> {
    const response: AxiosResponse<{ success: boolean; data: Training }> = 
      await apiClient.put(`/trainings/${trainingId}`, trainingData);
    return response.data.data;
  }

  /**
   * Actualiza el estado de un entrenamiento
   */
  async updateTrainingStatus(trainingId: number, status: TrainingStatus): Promise<Training> {
    const response: AxiosResponse<{ success: boolean; data: Training }> = 
      await apiClient.patch(`/trainings/${trainingId}/status`, { status });
    return response.data.data;
  }

  /**
   * Elimina un entrenamiento
   */
  async deleteTraining(trainingId: number): Promise<void> {
    await apiClient.delete(`/trainings/${trainingId}`);
  }

  /**
   * Obtiene los detalles de un entrenamiento (AKA Ejercicios)
   */
  async getTrainingDetails(trainingId: number): Promise<TrainingDetail[]> {
    const response: AxiosResponse<{ success: boolean; data: TrainingDetail[] }> = 
      await apiClient.get(`/trainings/${trainingId}/details`);
    return response.data.data;
  }

  /**
   * Añade un detalle a un entrenamiento (AKA Ejercicio)
   */
  async addTrainingDetail(trainingId: number, detailData: TrainingDetailCreate): Promise<TrainingDetail> {
    const response: AxiosResponse<{ success: boolean; data: TrainingDetail }> = 
      await apiClient.post(`/trainings/${trainingId}/details`, detailData);
    return response.data.data;
  }

  /**
   * Actualiza un detalle de entrenamiento (AKA Ejercicio)
   */
  async updateTrainingDetail(
    trainingId: number, 
    detailId: number, 
    detailData: TrainingDetailUpdate
  ): Promise<TrainingDetail> {
    const response: AxiosResponse<{ success: boolean; data: TrainingDetail }> = 
      await apiClient.put(`/trainings/${trainingId}/details/${detailId}`, detailData);
    return response.data.data;
  }

  /**
   * Elimina un detalle de entrenamiento (AKA Ejercicio)
   */
  async deleteTrainingDetail(trainingId: number, detailId: number): Promise<void> {
    await apiClient.delete(`/trainings/${trainingId}/details/${detailId}`);
  }
}

export default new TrainingsService();
