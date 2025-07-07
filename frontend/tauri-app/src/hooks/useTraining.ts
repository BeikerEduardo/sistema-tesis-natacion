import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import trainingsService from '@/services/trainings/trainingsService';
import { TrainingUpdate, TrainingStatus } from '@/types/training';
import { TrainingDetailCreate, TrainingDetailUpdate } from '@/types/trainingDetail';
import { TRAININGS_QUERY_KEY} from './useTrainings';

/**
 * Hook para gestionar un entrenamiento individual y sus detalles
 * @param trainingId ID del entrenamiento
 */
export const useTraining = (trainingId: number | null) => {
  const queryClient = useQueryClient();

  // Consulta para obtener un entrenamiento específico
  const {
    data: training,
    isLoading: isLoadingTraining,
    isError: isErrorTraining,
    error: trainingError,
    refetch: refetchTraining,
  } = useQuery({
    queryKey: [TRAININGS_QUERY_KEY, trainingId],
    queryFn: async () => {
      if (!trainingId) return null;
      try {
        return await trainingsService.getTraining(trainingId);
      } catch (err: any) {
        console.error(`Error fetching training ${trainingId}:`, err);
        toast.error(`Error al cargar entrenamiento: ${err.message}`);
        throw err;
      }
    },
    enabled: !!trainingId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });



  // Mutación para actualizar un entrenamiento
  const updateTrainingMutation = useMutation({
    mutationFn: (data: TrainingUpdate) => {
      if (!trainingId) throw new Error('No training ID provided');
      return trainingsService.updateTraining(trainingId, data);
    },
    onSuccess: () => {
      toast.success('Entrenamiento actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY, trainingId] });
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY] }); // Invalidar lista general
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar entrenamiento: ${error.message}`);
    },
  });

  // Mutación para actualizar el estado de un entrenamiento
  const updateTrainingStatusMutation = useMutation({
    mutationFn: (status: TrainingStatus) => {
      if (!trainingId) throw new Error('No training ID provided');
      return trainingsService.updateTrainingStatus(trainingId, status);
    },
    onSuccess: () => {
      toast.success('Estado del entrenamiento actualizado');
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY, trainingId] });
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY] }); // Invalidar lista general
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar estado: ${error.message}`);
    },
  });

  // Mutación para eliminar un entrenamiento
  const deleteTrainingMutation = useMutation({
    mutationFn: () => {
      if (!trainingId) throw new Error('No training ID provided');
      return trainingsService.deleteTraining(trainingId);
    },
    onSuccess: () => {
      toast.success('Entrenamiento eliminado con éxito');
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar entrenamiento: ${error.message}`);
    },
  });


  // Funciones auxiliares
  const updateTraining = (data: TrainingUpdate) => updateTrainingMutation.mutate(data);
  const updateTrainingStatus = (status: TrainingStatus) => updateTrainingStatusMutation.mutate(status);
  const deleteTraining = () => deleteTrainingMutation.mutate();

  // Refrescar datos cuando cambia el ID del entrenamiento
  useEffect(() => {
    if (trainingId) {
      refetchTraining();
    }
  }, [trainingId, refetchTraining,]);

  return {
    // Datos
    training,
    
    // Estados
    isLoading: isLoadingTraining,
    isLoadingTraining,
    isError: isErrorTraining,
    isErrorTraining,
    error: trainingError,
    trainingError,
    
    // Acciones
    refetchTraining,
    updateTraining,
    updateTrainingStatus,
    deleteTraining,
    
    // Objetos de mutación completos
    updateTrainingMutation,
    updateTrainingStatusMutation,
    deleteTrainingMutation,
  };
};
