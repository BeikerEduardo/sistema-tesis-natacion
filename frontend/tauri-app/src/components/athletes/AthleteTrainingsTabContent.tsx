import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns-tz';
import { es } from 'date-fns/locale/es';

// Configuración local para fechas
const dateConfig = { locale: es, timeZone: 'America/Santiago' };
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { Eye } from 'lucide-react';
import { useTrainings } from '@/hooks/useTrainings';


const AthleteTrainingsTabContent = () => {
  const navigate = useNavigate();

  const { id: athleteId } = useParams<{ id: string }>();
  const { trainings, isLoading, page,
    limit,
    totalPages,
    totalItems,
    setPage,
    setLimit, } = useTrainings(Number(athleteId));

    const translateTrainingType = (type: string) => {
      switch (type) {
        case 'technique':
          return 'Técnica';
        case 'speed':
          return 'Velocidad';
        case 'resistance':
          return 'Resistencia';
        case 'mixed':
          return 'Mixto';
        case 'other':
          return 'Otro';
        default:
          return type;
      }
    };

  const formatTrainingDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', dateConfig);
    } catch (error) {
      return 'Fecha inválida';
    }
  };

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


  if (isLoading && trainings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de entrenamientos</CardTitle>
          <CardDescription>Cargando entrenamientos...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Historial de entrenamientos</CardTitle>
            <CardDescription>
              {totalItems} entrenamientos registrados
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trainings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay entrenamientos registrados.</p> 
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">
                        {formatTrainingDate(training.date)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {translateTrainingType(training.trainingType)}
                      </TableCell>
                      <TableCell>
                        {training.durationMinutes ? `${training.durationMinutes} min` : 'No especificada'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          training.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : training.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {training.status === 'completed' ? 'Completado' : 
                           training.status === 'cancelled' ? 'Cancelado' : 'Programado'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={()=>navigate(`/trainings/${training.id}`)}>
                          <Eye />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center justify-center w-10 h-10 rounded-md border">
                  {page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AthleteTrainingsTabContent;