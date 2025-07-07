import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import trainingsService from '@/services/trainings/trainingsService';
import { Training, TrainingCreate, TrainingUpdate, TrainingStatus } from '@/types/training';
import { TrainingDetail, TrainingDetailCreate, TrainingDetailUpdate } from '@/types/trainingDetail';

// Claves para React Query
export const TRAININGS_QUERY_KEY = 'trainings';
export const TRAINING_DETAILS_QUERY_KEY = 'training-details';

// Tipo para el contexto de las mutaciones optimistas
interface MutationContext {
  previousTrainings: Training[];
}

/**
 * Hook para gestionar los entrenamientos
 * @param athleteId ID del atleta (opcional)
 * @param initialPage Página inicial para paginación
 * @param initialLimit Límite de elementos por página
 */
export const useTrainings = (athleteId?: number, initialPage = 1, initialLimit = 10) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Consulta para obtener los entrenamientos
  const {
    data: trainings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: athleteId 
      ? [TRAININGS_QUERY_KEY, 'athlete', athleteId, page, limit] 
      : [TRAININGS_QUERY_KEY, page, limit],
    queryFn: async () => {
      try {
        if (athleteId) {
          return await trainingsService.getAthleteTrainings(athleteId);
        } else {
          return await trainingsService.getAllTrainings(page, limit);
        }
      } catch (err: any) {
        console.error('Error fetching trainings:', err);
        toast.error(`Error al cargar entrenamientos: ${err.message}`);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear un entrenamiento
  const createTrainingMutation = useMutation({
    mutationFn: (newTraining: TrainingCreate) => trainingsService.createTraining(newTraining),
    onSuccess: () => {
      toast.success('Entrenamiento creado con éxito');
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(`Error al crear entrenamiento: ${error.message}`);
    },
  });

  // Mutación para actualizar un entrenamiento
  const updateTrainingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TrainingUpdate }) => 
      trainingsService.updateTraining(id, data),
    onSuccess: () => {
      toast.success('Entrenamiento actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar entrenamiento: ${error.message}`);
    },
  });

  // Mutación para actualizar el estado de un entrenamiento
  const updateTrainingStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TrainingStatus }) => 
      trainingsService.updateTrainingStatus(id, status),
    onSuccess: () => {
      toast.success('Estado del entrenamiento actualizado');
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar estado: ${error.message}`);
    },
  });

  // Mutación para eliminar un entrenamiento
  const deleteTrainingMutation = useMutation({
    mutationFn: (id: number) => trainingsService.deleteTraining(id),
    onMutate: async (id) => {
      // Cancelar consultas en curso
      await queryClient.cancelQueries({ queryKey: [TRAININGS_QUERY_KEY] });
      
      // Guardar estado anterior
      const previousTrainings = queryClient.getQueryData<Training[]>([TRAININGS_QUERY_KEY]) || [];
      
      // Optimistic update
      queryClient.setQueryData<Training[]>(
        [TRAININGS_QUERY_KEY],
        previousTrainings.filter(training => training.id !== id)
      );
      
      return { previousTrainings };
    },
    onSuccess: () => {
      toast.success('Entrenamiento eliminado con éxito');
    },
    onError: (error: any, _, context: MutationContext | undefined) => {
      // Revertir a estado anterior en caso de error
      if (context?.previousTrainings) {
        queryClient.setQueryData([TRAININGS_QUERY_KEY], context.previousTrainings);
      }
      toast.error(`Error al eliminar entrenamiento: ${error.message}`);
    },
    onSettled: () => {
      // Refrescar datos
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY] });
    },
  });

  // Funciones auxiliares
  const createTraining = (data: TrainingCreate) => createTrainingMutation.mutate(data);
  const updateTraining = (id: number, data: TrainingUpdate) => updateTrainingMutation.mutate({ id, data });
  const updateTrainingStatus = (id: number, status: TrainingStatus) => updateTrainingStatusMutation.mutate({ id, status });
  const deleteTraining = (id: number) => deleteTrainingMutation.mutate(id);

  return {
    // Datos
    trainings,
    
    // Paginación
    page,
    limit,
    totalPages,
    totalItems,
    setPage,
    setLimit,
    
    // Estados
    isLoading,
    isError,
    error,
    
    // Acciones
    refetch,
    createTraining,
    updateTraining,
    updateTrainingStatus,
    deleteTraining,
    
    // Objetos de mutación completos (para componentes que necesitan acceso al objeto completo)
    createTrainingMutation,
    updateTrainingMutation,
    updateTrainingStatusMutation,
    deleteTrainingMutation
  };
};