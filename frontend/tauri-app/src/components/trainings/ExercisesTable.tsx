import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrainingDetail } from '@/types/trainingDetail';
import { Edit, Trash2, Ruler, Repeat, Zap, Clock3 } from 'lucide-react';
import { useMatch } from 'react-router-dom';

interface ExercisesTableProps {
  trainingDetails: TrainingDetail[];
  onEdit: (trainingDetail: TrainingDetail, index: number) => void;
  onDelete: (index: number) => void;
}

export const ExercisesTable = ({ trainingDetails, onEdit, onDelete }: ExercisesTableProps) => {

  const isEditRoute = useMatch('/trainings/:id/edit');
  const isNewRoute = useMatch('/trainings/new');

  // Log para depuración
  console.log('Rendering ExercisesTable with exercises:', trainingDetails);
  
  // Check if trainingDetails is undefined or empty
  if (!trainingDetails || trainingDetails.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay ejercicios añadidos. Haz clic en "Agregar Ejercicio" para comenzar.
      </div>
    );
  }


  const formatTime = (timeValue: number | string | undefined | null) => {
    // Handle undefined or null values
    if (timeValue === undefined || timeValue === null) return '--:--';
    
    // Convert to number if it's a string
    const seconds = typeof timeValue === 'string' ? parseFloat(timeValue) : timeValue;
    
    // Handle invalid numbers
    if (isNaN(seconds) || seconds < 0) return '--:--';
    
    // Round to nearest second and cap at 99:59
    const totalSeconds = Math.min(Math.round(seconds), 99 * 60 + 59);
    
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    // Format as MM:SS
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSwimStyleLabel = (style: string | undefined) => {
    const styles: Record<string, string> = {
      'freestyle': 'Libre',
      'backstroke': 'Espalda',
      'breaststroke': 'Pecho',
      'butterfly': 'Mariposa',
      'medley': 'Estilos',
      'other': 'Otro'
    };
    return style ? styles[style] || style : '--';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w">Ejercicio (Estilo)</TableHead>
            <TableHead className="text-center">Distancia</TableHead>
            <TableHead className="text-center">Tiempo</TableHead>
            <TableHead className="text-center">Series x Reps</TableHead>
            <TableHead className="text-center">Descanso</TableHead>
            <TableHead className="text-center">Notas</TableHead>
            {(isEditRoute || isNewRoute) && (
              <TableHead className="text-right">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainingDetails.map((trainingDetail, index) => (
            <TableRow key={trainingDetail.id || index}>
              <TableCell className="font-medium">
                <div className="font-medium">{getSwimStyleLabel(trainingDetail.swimStyle)}</div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{trainingDetail.distance || '--'} m</span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatTime(trainingDetail.timeSeconds)}</span>
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{trainingDetail.seriesNumber || 1} x {trainingDetail.repetitionNumber || 1}</span>
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{trainingDetail.restIntervalSeconds || '--'}s</span>
                </div>
              </TableCell>
              

              <TableCell className="font-medium">
                <div className="font-medium">{trainingDetail.notes}</div>
              </TableCell>
              {(isEditRoute || isNewRoute) && (
                <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(trainingDetail, index)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExercisesTable;
