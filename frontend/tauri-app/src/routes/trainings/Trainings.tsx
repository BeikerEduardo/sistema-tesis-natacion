import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTrainings } from '@/hooks/useTrainings';
import { TrainingsTable } from '@/components/trainings/TrainingsTable';
import { PageLoader } from '@/components/ui/Loader';
import { useNavigate } from 'react-router-dom';

const Trainings = () => {
  const navigate = useNavigate();
  // Obtener la lista de entrenamientos usando el hook personalizado con paginación
  const { 
    trainings = [], 
    isLoading, 
    error, 
    deleteTraining,
    deleteTrainingMutation, 
    page,
    setPage,
    totalPages,
    totalItems
  } = useTrainings(undefined, 1, 10); // Iniciar en página 1 con 10 elementos por página
  
  // Adaptador para convertir la función deleteTraining en una que devuelva una Promise
  const handleDeleteTraining = async (id: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        deleteTraining(id);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

    
  // Funciones para manejar la paginación
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };



  if (isLoading) {
    return (
      <PageLoader text="Cargando entrenamientos..."/>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error al cargar los entrenamientos</p>
        <p>{error.message || 'Error desconocido'}</p>
        <button 
          onClick={() => navigate('/trainings')}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Entrenamientos</h1>
          <p className="text-muted-foreground">
            Gestiona y revisa los entrenamientos programados
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button asChild>
            <Link to="/trainings/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Entrenamiento
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-t p-4">
          <TrainingsTable 
            data={trainings} 
            isDeleting={deleteTrainingMutation.isPending} 
            deleteTraining={handleDeleteTraining}
          />
          
          {/* Controles de paginación */}
          <div className="flex items-center justify-between px-2 mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{trainings.length > 0 ? (page - 1) * 10 + 1 : 0}</span> a{' '}
              <span className="font-medium">
                {Math.min(page * 10, totalItems)}
              </span>{' '}
              de <span className="font-medium">{totalItems}</span> entrenamientos
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <div className="flex items-center justify-center w-10 h-10 rounded-md border">
                {page}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages || isLoading}
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainings;