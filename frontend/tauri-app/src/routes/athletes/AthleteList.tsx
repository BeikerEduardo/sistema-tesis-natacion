import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAthletes } from '@/hooks/useAthletes';
import { PageLoader } from '@/components/ui/Loader';

export function AthleteList() {
  const navigate = useNavigate();
  const { athletes, isLoading, error, deleteAthlete } = useAthletes();

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${name}?`)) {
      try {
        await deleteAthlete(id);
        // La notificación de éxito se maneja en el hook
      } catch (error) {
        // La notificación de error se maneja en el hook
      }
    }
  };

  if (isLoading) {
    return (
      <PageLoader text="Cargando atletas..."/>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error.message || 'Error al cargar los atletas'}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Atletas</h1>
        <Button onClick={() => navigate('/athletes/new')}>
          Nuevo Atleta
        </Button>
      </div>

      <div className="grid gap-4">
        {athletes?.map((athlete) => (
          <div key={athlete.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium">{`${athlete.firstName} ${athlete.lastName}`}</h3>
              <p className="text-sm text-gray-500">{athlete.category}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/athletes/${athlete.id}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(athlete.id, `${athlete.firstName} ${athlete.lastName}`)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
        {athletes?.length === 0 && (
          <p className="text-center text-gray-500 py-8">No hay atletas registrados</p>
        )}
      </div>
    </div>
  );
}
