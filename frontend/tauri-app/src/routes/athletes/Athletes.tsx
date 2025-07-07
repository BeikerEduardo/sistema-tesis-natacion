import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAthletes } from '@/hooks/useAthletes';
import { AthletesTable } from '@/components/athletes/AthletesTable';
import AthletesError from '@/components/athletes/AthletesError';
import { PageLoader } from '@/components/ui/Loader';

const Athletes = () => {
  // Obtener la lista de atletas y funciones de mutación
  const { 
    athletes = [], 
    isLoading, 
    error, 
    deleteMutation,
    isDeleting 
  } = useAthletes();

  // Debug: Log the athletes data and loading state
  useEffect(() => {
    console.log('Athletes data:', athletes);
    console.log('Is loading:', isLoading);
    console.log('Error:', error);
  }, [athletes, isLoading, error]);

  // Asegurarse de que athletes sea un array
  const athletesData = Array.isArray(athletes) ? athletes : [];

  if (isLoading) {
    return (
      <PageLoader text="Cargando atletas..." />
    );
  }

  if (error) {
    return <AthletesError error={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Atletas</h1>
          <p className="text-muted-foreground">
            Gestiona la información de los atletas
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button asChild>
            <Link to="/athletes/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Atleta
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <AthletesTable 
            data={athletesData} 
            isDeleting={isDeleting} 
            deleteAthlete={async (id: number) => {
              return await deleteMutation.mutateAsync(id);
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Athletes;
