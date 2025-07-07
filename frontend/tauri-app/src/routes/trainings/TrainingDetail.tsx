import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TrainingStatus } from '@/types/training';
import { ExternalFactorCreate } from '@/types/externalFactor';
import { TRAININGS_QUERY_KEY } from '@/hooks/useTrainings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  // Basic UI Icons
  ArrowLeft,
  Edit,
  AlertCircle,
  Loader2,

} from 'lucide-react';
import { PageLoader } from '@/components/ui/Loader';

import externalFactorsService from '@/services/externalFactors/externalFactorsService';
import TrainingError from '@/components/trainings/TrainingError';
import DeleteIncidentModal from '@/components/trainings/trainingDetail/TrainingDetailDeleteIncidentModal';
import ChangeTrainingStatusModal from '@/components/trainings/trainingDetail/ChangeTrainingStatusModal';
import TrainingDetailPhysicalDataCard from '@/components/trainings/trainingDetail/TrainingDetailPhysicalDataCard';
import TrainingDetailMainInfoCard from '@/components/trainings/trainingDetail/TrainingDetailMainInfoCard';
import TrainingDetailExternalFactorsCard from '@/components/trainings/trainingDetail/TrainingDetailExternalFactorsCard';
import TrainingDetailAttendanceCard from '@/components/trainings/trainingDetail/TrainingDetailAttendanceCard';
import TrainingDetailQuickActionsCard from '@/components/trainings/trainingDetail/TrainingDetailQuickActionsCard';
import { useTraining } from '@/hooks/useTraining';
import toast from "react-hot-toast";
import TrainingDetailExercisesCard from '@/components/trainings/trainingDetail/TrainingDetailExercisesCard';
import TrainingDetailUsedEquipmentCard from '@/components/trainings/trainingDetail/TrainingDetailUsedEquipmentCard';
import { IncidentFormData } from '@/components/trainings/trainingDetail/IncidentForm';

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trainingId = id ? parseInt(id) : null;
  const {
    training,
    error,
    isLoading,
    deleteTrainingMutation,
    updateTrainingStatusMutation,
    deleteTraining,
    updateTrainingStatus
  } = useTraining(trainingId);
  
  // Estados para el modal de cambio de estado
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus>('completed');
  
  // Funciones para manejar el cambio de estado
  const handleStatusChange = () => {
    if (trainingId) {
      updateTrainingStatus(pendingStatus);
      setStatusDialogOpen(false);
    }
  };
  
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };
  
  const openCompleteDialog = () => {
    setPendingStatus('completed');
    setStatusDialogOpen(true);
  };
  
  const openCancelDialog = () => {
    setPendingStatus('cancelled');
    setStatusDialogOpen(true);
  };

  console.log(training)

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Estado para el diálogo de eliminación de incidencias
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);

  // Estado para la paginación de incidencias
  const [currentPage, setCurrentPage] = useState(1);
  const incidentsPerPage = 1; // Número de incidencias por página

  // Mutación para crear una nueva incidencia
  const createIncidentMutation = useMutation({
    mutationFn: externalFactorsService.createExternalFactor,
    onSuccess: () => {
      toast.success('Incidencia reportada correctamente');
      // Invalidar consultas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: [TRAININGS_QUERY_KEY, Number(id)] });
    },
    onError: (error: Error) => {
      toast.error(`Error al reportar la incidencia: ${error.message}`);
    }
  });

  // Mutación para eliminar una incidencia
  const deleteIncidentMutation = useMutation({
    mutationFn: async (incidentId: number) => {
      return externalFactorsService.deleteExternalFactor(incidentId);
    },
    onSuccess: () => {
      toast.success('Incidencia eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: ['training', id] });
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la incidencia: ${error.message}`);
    }
  });

  const handleDeleteTraining = () => {
    try {
      deleteTraining();
      navigate('/trainings');
      toast.success('Entrenamiento eliminado correctamente');
    } catch (error) {
      toast.error(`Error al eliminar el entrenamiento`);
    }
  };

  // Manejar la creación de una nueva incidencia
  const handleCreateIncident = (data: IncidentFormData) => {
    // Transformar IncidentFormData a ExternalFactorCreate
    const externalFactorData: ExternalFactorCreate = {
      athleteId: data.athleteId || (training?.athlete?.id || 0),
      trainingId: Number(id),
      factorType: data.factorType,
      description: data.description,
      severity: data.severity,
      // Convertir fechas a formato string ISO
      startDate: data.startDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : data.startDate.toISOString(),
      performanceImpact: data.performanceImpact,
      notes: data.notes
    };
    
    createIncidentMutation.mutate(externalFactorData);
  };

  // Abrir el diálogo de confirmación de eliminación
  const openDeleteDialog = (incidentId: number) => {
    setSelectedIncidentId(incidentId);
    setDeleteDialogOpen(true);
  };

  // Cancelar la eliminación
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedIncidentId(null);
  };

  // Confirmar la eliminación
  const handleDeleteConfirm = () => {
    if (selectedIncidentId !== null) {
      deleteIncidentMutation.mutate(selectedIncidentId);
      setDeleteDialogOpen(false);
      setSelectedIncidentId(null);
    }
  };


  if (isLoading) {
    return <PageLoader text="Cargando entrenamiento..." />;
  }

  if (error) {
    return (
      <TrainingError />
    );
  }

  if (!training) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold">Entrenamiento no encontrado</h3>
          <p className="text-muted-foreground">El entrenamiento solicitado no existe o ha sido eliminado.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => navigate('/trainings')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a entrenamientos
        </Button>
      </div>
    );
  }

  // Calcular duración total
  const start = new Date(`2000-01-01T${training.startTime}`);
  const end = new Date(`2000-01-01T${training.endTime}`);
  const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{training.title}</h1>
            <p className="text-muted-foreground">
              {training.date ? new Date(training.date).toLocaleDateString() : 'No date'} • {training.startTime || '--'} - {training.endTime || '--'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link to={`/trainings/${id}/edit`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          {/* Botón para eliminar el entrenamiento */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="inline-block">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={deleteTrainingMutation.isPending}
                >
                  {deleteTrainingMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Eliminar entrenamiento
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro de eliminar este entrenamiento?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a este entrenamiento.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTraining}
                  disabled={deleteTrainingMutation.isPending}
                >
                  {deleteTrainingMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Eliminar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>


      <div className="grid gap-4 grid-cols-3">

        <section className="col-span-2 flex flex-col gap-6">
          {/* Información principal */}
          <TrainingDetailMainInfoCard training={training} />

          {/* Sección de Ejercicios */}
          <TrainingDetailExercisesCard trainingDetails={training?.details || []} />

          {/* Sección de datos físicos del atleta */}
          <TrainingDetailPhysicalDataCard physicalData={{
            weightBefore: training?.weightBefore ?? 0,
            weightAfter: training?.weightAfter ?? 0,
            breathingPattern: training?.breathingPattern ?? '',
            physicalStateRating: training?.physicalStateRating ?? 0,
            painReported: training?.painReported ?? '',
          }} />

          {/* Sección de equipamiento usado */}
          <TrainingDetailUsedEquipmentCard equipment={{
            swimsuitType: training?.swimsuitType ?? '',
            equipmentUsed: training?.equipmentUsed ?? '',
          }} />
        </section>




        {/* Barra lateral */}
        <section className="col-span-1 space-y-4">
          <TrainingDetailAttendanceCard athlete={training?.athlete} />

          <TrainingDetailQuickActionsCard
            training={training}
            onCreateIncident={handleCreateIncident}
            onCancelIncident={() => { }} // Empty function for now as cancel handler
            onOpenCompleteDialog={openCompleteDialog}
            onOpenCancelDialog={openCancelDialog}
            statusDialogOpen={statusDialogOpen}
            setStatusDialogOpen={setStatusDialogOpen}
            handleStatusDialogClose={handleStatusDialogClose}
            handleStatusChange={handleStatusChange}
            pendingStatus={pendingStatus}
          />

          {/* Sección de Incidencias Reportadas */}
          <TrainingDetailExternalFactorsCard
            externalFactors={training?.externalFactors || []}
            deleteIncidentMutation={deleteIncidentMutation}
            openDeleteDialog={openDeleteDialog}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            incidentsPerPage={incidentsPerPage}
          />
        </section>


      </div>

      <DeleteIncidentModal
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        deleteIncidentMutation={deleteIncidentMutation}
      />
    </div>
  );
};

export default TrainingDetail;
