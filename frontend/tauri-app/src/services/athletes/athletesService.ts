import { Athlete, AthleteCreate, AthleteUpdate } from '@/types/athlete';
import apiClient from '../api';
import { AxiosResponse } from 'axios';

/**
 * Servicio para la gestión de atletas
 */
class AthletesService {
  /**
   * Obtiene todos los atletas del entrenador
   */
  async getAllAthletes(): Promise<Athlete[]> {
    const response: AxiosResponse<{ success: boolean; data: Athlete[] }> = 
      await apiClient.get('/athletes');
    return response.data.data;
  }

  /**
   * Obtiene un atleta por su ID
   */
  async getAthlete(athleteId: number): Promise<Athlete> {
    const response: AxiosResponse<{ success: boolean; data: Athlete }> = 
      await apiClient.get(`/athletes/${athleteId}`);
    return response.data.data;
  }

  /**
   * Crea un nuevo atleta
   */
  async createAthlete(athleteData: AthleteCreate): Promise<Athlete> {
    const response: AxiosResponse<{ success: boolean; data: Athlete }> = 
      await apiClient.post('/athletes', athleteData);
    return response.data.data;
  }

  /**
   * Actualiza un atleta existente
   */
  async updateAthlete(athleteId: number, athleteData: AthleteUpdate): Promise<Athlete> {
    const response: AxiosResponse<{ success: boolean; data: Athlete }> = 
      await apiClient.put(`/athletes/${athleteId}`, athleteData);
    return response.data.data;
  }

  /**
   * Elimina un atleta
   */
  async deleteAthlete(athleteId: number): Promise<void> {
    await apiClient.delete(`/athletes/${athleteId}`);
  }
}

export default new AthletesService();
