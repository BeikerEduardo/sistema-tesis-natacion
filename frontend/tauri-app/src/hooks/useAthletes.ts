import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import athletesService from '@/services/athletes/athletesService';
import { Athlete, AthleteCreate, AthleteUpdate } from '@/types/athlete';

// Clave de consulta para la caché
export const ATHLETES_QUERY_KEY = 'athletes';

// Tipos para las mutaciones
type CreateAthleteData = AthleteCreate;
type UpdateAthleteData = AthleteUpdate & { id: number };

// Tipo para el contexto de las mutaciones optimistas
type MutationContext = {
  previousAthletes?: Athlete[];
};

/**
 * Hook para manejar las operaciones relacionadas con atletas
 * Utiliza React Query para el manejo de estado del servidor
 */
export const useAthletes = () => {
  const queryClient = useQueryClient();

  // Obtener todos los atletas
  const { 
    data: athletes = [], 
    isLoading, 
    error,
    isError,
    refetch
  } = useQuery<Athlete[]>({
    queryKey: [ATHLETES_QUERY_KEY],
    queryFn: async () => {
      try {
        return await athletesService.getAllAthletes();
      } catch (err) {
        console.error('Error fetching athletes:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de datos frescos
    gcTime: 10 * 60 * 1000, // 10 minutos en caché
  });

  /**
   * Obtener un atleta por su ID
   * @param id ID del atleta
   */
  const useAthlete = (id: number | undefined) => {
    return useQuery<Athlete>({
      queryKey: [ATHLETES_QUERY_KEY, id],
      queryFn: () => id ? athletesService.getAthlete(id) : Promise.reject('ID de atleta no proporcionado'),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Crear un nuevo atleta con actualización optimista
  const createMutation = useMutation<Athlete, Error, CreateAthleteData, MutationContext>({
    mutationFn: (athleteData) => athletesService.createAthlete(athleteData),
    onMutate: async (newAthlete) => {
      // Cancelar cualquier consulta pendiente
      await queryClient.cancelQueries({ queryKey: [ATHLETES_QUERY_KEY] });
      
      // Obtener el estado anterior para poder hacer rollback si es necesario
      const previousAthletes = queryClient.getQueryData<Athlete[]>([ATHLETES_QUERY_KEY]) || [];
      
      // Crear un ID temporal para la actualización optimista
      const tempId = Date.now();
      
      const optimisticAthlete = {
        ...newAthlete,
        id: tempId,
        coachId: 0, // Se establecerá en el backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Athlete;
      
      // Actualizar la caché con el nuevo atleta
      queryClient.setQueryData<Athlete[]>([ATHLETES_QUERY_KEY], (old = []) => 
        [...old, optimisticAthlete]
      );
      
      // Mostrar notificación
      toast.success('Creando atleta...');
      
      return { previousAthletes };
    },
    onError: (error, _, context) => {
      // Revertir al estado anterior en caso de error
      if (context?.previousAthletes) {
        queryClient.setQueryData([ATHLETES_QUERY_KEY], context.previousAthletes);
      }
      toast.error(`Error al crear el atleta: ${error.message}`);
    },
    onSuccess: () => {
      // Invalidar y volver a obtener la lista de atletas
      queryClient.invalidateQueries({ queryKey: [ATHLETES_QUERY_KEY] });
      toast.success('Atleta creado exitosamente');
    }
  });

  // Actualizar un atleta con actualización optimista
  const updateMutation = useMutation<Athlete, Error, UpdateAthleteData, MutationContext>({
    mutationFn: ({ id, ...data }) => athletesService.updateAthlete(id, data),
    onMutate: async (updatedAthlete) => {
      // Cancelar cualquier consulta pendiente
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [ATHLETES_QUERY_KEY] }),
        queryClient.cancelQueries({ queryKey: [ATHLETES_QUERY_KEY, updatedAthlete.id] }),
      ]);
      
      // Obtener el estado anterior para poder hacer rollback si es necesario
      const previousAthletes = queryClient.getQueryData<Athlete[]>([ATHLETES_QUERY_KEY]) || [];

      // Actualizar la caché con el atleta actualizado
      queryClient.setQueryData<Athlete[]>([ATHLETES_QUERY_KEY], (old = []) =>
        old.map(athlete => 
          athlete.id === updatedAthlete.id 
            ? { 
                ...athlete, 
                ...updatedAthlete,
                id: updatedAthlete.id, // Ensure id is included
                updatedAt: new Date().toISOString() 
              } as Athlete
            : athlete
        )
      );
      
      // Mostrar notificación
      toast.success('Actualizando atleta...');
      
      return { previousAthletes };
    },
    onError: (error, _, context) => {
      // Revertir al estado anterior en caso de error
      if (context?.previousAthletes) {
        queryClient.setQueryData([ATHLETES_QUERY_KEY], context.previousAthletes);
      }
      toast.error(`Error al actualizar el atleta: ${error.message}`);
    },
    onSuccess: (_, variables) => {
      // Invalidar y volver a obtener los datos relevantes
      queryClient.invalidateQueries({ queryKey: [ATHLETES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ATHLETES_QUERY_KEY, variables.id] });
      toast.success('Atleta actualizado exitosamente');
    },
  });

  // Eliminar un atleta con actualización optimista
  const deleteMutation = useMutation<void, Error, number, MutationContext>({
    mutationFn: (athleteId) => athletesService.deleteAthlete(athleteId),
    onMutate: async (athleteId) => {
      // Cancelar cualquier consulta pendiente
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [ATHLETES_QUERY_KEY] }),
        queryClient.cancelQueries({ queryKey: [ATHLETES_QUERY_KEY, athleteId] }),
      ]);
      
      // Obtener el estado anterior para poder hacer rollback si es necesario
      const previousAthletes = queryClient.getQueryData<Athlete[]>([ATHLETES_QUERY_KEY]) || [];
      
      // Actualizar la caché eliminando el atleta
      queryClient.setQueryData<Athlete[]>([ATHLETES_QUERY_KEY], (old = []) =>
        old.filter(athlete => athlete.id !== athleteId)
      );
      
      // Mostrar notificación
      toast.loading('Eliminando atleta...');
      
      return { previousAthletes };
    },
    onError: (error, _, context) => {
      // Revertir al estado anterior en caso de error
      if (context?.previousAthletes) {
        queryClient.setQueryData([ATHLETES_QUERY_KEY], context.previousAthletes);
      }
      toast.error(`Error al eliminar el atleta: ${error.message}`);
    },
    onSuccess: () => {
      // Mostrar notificación de éxito
      toast.success('Atleta eliminado exitosamente');
      // Invalidar y volver a obtener la lista de atletas
      queryClient.invalidateQueries({ queryKey: [ATHLETES_QUERY_KEY] });
    }
  });

  return {
    // Datos
    athletes,
    
    // Estados
    isLoading,
    isError,
    error: error as Error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Acciones
    refetch,
    
    // Hooks
    useAthlete,
    
    // Mutaciones
    createAthlete: createMutation.mutateAsync,
    updateAthlete: updateMutation.mutateAsync,
    deleteAthlete: deleteMutation.mutateAsync,
    
    // Estados de mutaciones
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
