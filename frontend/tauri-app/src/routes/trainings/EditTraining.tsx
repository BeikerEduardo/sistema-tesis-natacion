import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageLoader } from '@/components/ui/Loader';

import { Button } from '@/components/ui/button';
import TrainingForm from '@/components/trainings/TrainingForm';
import type { Training } from '@/types/training';
import { useTraining } from '@/hooks/useTraining';

// Función eliminada ya que ahora procesamos los ejercicios directamente en el componente

// Función auxiliar para manejar fechas de forma segura
const safeDate = (date: string | Date | undefined): Date => {
  if (!date) return new Date();

  try {
    const parsedDate = date instanceof Date ? date : new Date(date);
    // Verificar si la fecha es válida
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date detected in EditTraining:', date);
      return new Date(); // Usar fecha actual como fallback
    }
    return parsedDate;
  } catch (error) {
    console.error('Error parsing date in EditTraining:', error);
    return new Date(); // Usar fecha actual como fallback
  }
};

const EditTraining = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { training, isLoading, error, updateTrainingMutation } = useTraining(Number(id));


  const handleSuccess = () => {
    // Redirect to the training detail page after a short delay
    setTimeout(() => {
      navigate(`/trainings/${id}`);
    }, 1000);
  };

  if (isLoading) {
    return <PageLoader text="Cargando datos del entrenamiento..." />;
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> No se pudo cargar el entrenamiento. Por favor, inténtalo de nuevo.</span>
          <div className="mt-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Atención</strong>
          <span className="block sm:inline"> No se encontró el entrenamiento solicitado.</span>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/trainings')}>
              Volver a la lista de entrenamientos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Transform the training data to match the form data structure
  console.log('Raw training data from API:', training);
  
  // Asegurarse de que los ejercicios estén completos
  const processedExercises = Array.isArray(training.details) ? training.details.map(ex => ({
    id: ex.id || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    distance: ex.distance || 0,
    swimStyle: ex.swimStyle || 'freestyle',
    timeSeconds: ex.timeSeconds || 0,
    seriesNumber: ex.seriesNumber || 1,
    repetitionNumber: ex.repetitionNumber || 1,
    restIntervalSeconds: ex.restIntervalSeconds || 0,
    strokeCount: ex.strokeCount || 0,
    efficiency: ex.efficiency || 0,
    notes: ex.notes || ''
  })) : [];
  
  console.log('Processed exercises for form:', processedExercises);
  
  // Preparamos los valores por defecto para el formulario
  const defaultValues = {
    ...training,
    date: safeDate(training.date).toISOString(),
    notes: training.notes || '',
    details: processedExercises
  } as Training;


  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">

        <div className="flex items-center space-x-4 mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Editar Entrenamiento</h1>
        </div>
        
        <p className="text-muted-foreground">
          Actualiza la información del entrenamiento programado para {(() => {
            try {
              const date = safeDate(training.date);
              return date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            } catch (error) {
              console.error('Error formatting date in EditTraining:', error);
              return 'fecha programada';
            }
          })()}.
        </p>
      </div>

      <TrainingForm
        isEditing={true}
        trainingId={Number(id)}
        defaultValues={defaultValues}
        onSuccess={handleSuccess}
        isSubmitting={updateTrainingMutation.isPending}
      />
    </div>
  );
};

export default EditTraining;
