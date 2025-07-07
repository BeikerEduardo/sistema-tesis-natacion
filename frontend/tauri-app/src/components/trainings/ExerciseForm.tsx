import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {TrainingDetail} from '@/types/trainingDetail';

interface ExerciseFormProps {
  onSave: (trainingDetail: Omit<TrainingDetail, 'id'>) => void;
  onCancel: () => void;
  defaultValues?: TrainingDetail;
  isEditing?: boolean;
}

const defaultExercise: Omit<TrainingDetail, 'id'> = {
  distance: 100, // Default 100 meters
  swimStyle: 'freestyle',
  timeSeconds: 60, // 1 minute
  seriesNumber: 1,
  repetitionNumber: 1,
  restIntervalSeconds: 30, // 30 seconds
  strokeCount: 0,
  efficiency: 0,
  notes: ''
};

export const ExerciseForm = ({
  onSave,
  onCancel,
  defaultValues,
  isEditing = false
}: ExerciseFormProps) => {
  const [exercise, setExercise] = useState<Omit<TrainingDetail, 'id'>>(
    defaultValues ? { ...defaultValues } : { ...defaultExercise }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExercise(prev => ({
      ...prev,
      [name]: ['distance', 'timeSeconds', 'seriesNumber', 'repetitionNumber',
        'restIntervalSeconds', 'strokeCount', 'efficiency'].includes(name)
        ? (name === 'efficiency' ? parseFloat(value) || 0 : parseInt(value) || 0)
        : value
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setExercise(prev => ({
      ...prev,
      [name]: ['swimStyle'].includes(name) ? value : value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (exercise.distance !== undefined && exercise.distance < 0) {
      newErrors.distance = 'La distancia no puede ser negativa';
    }

    if (exercise.timeSeconds !== undefined && exercise.timeSeconds < 0) {
      newErrors.timeSeconds = 'El tiempo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evitar que el evento se propague al formulario padre

    if (validateForm()) {
      onSave(exercise);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="distance">Distancia (metros) *</Label>
          <Input
            id="distance"
            name="distance"
            type="number"
            min="0"
            value={exercise.distance}
            onChange={handleChange}
            placeholder="Ej: 100"
          />
          {errors.distance && (
            <p className="text-sm text-red-500">{errors.distance}</p>
          )}
        </div>

      </div>

      <div className="space-y-2">
        <Label htmlFor="swimStyle">Estilo de nado</Label>
        <Select
          value={exercise.swimStyle}
          onValueChange={(value) => handleSelectChange('swimStyle', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estilo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freestyle">Libre</SelectItem>
            <SelectItem value="backstroke">Espalda</SelectItem>
            <SelectItem value="breaststroke">Pecho</SelectItem>
            <SelectItem value="butterfly">Mariposa</SelectItem>
            <SelectItem value="medley">Estilos</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeSeconds">Tiempo (segundos)</Label>
        <Input
          id="timeSeconds"
          name="timeSeconds"
          type="number"
          min="0"
          value={exercise.timeSeconds}
          onChange={handleChange}
          placeholder="Ej: 60"
        />
        {errors.timeSeconds && (
          <p className="text-sm text-red-500">{errors.timeSeconds}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="seriesNumber">Número de series</Label>
        <Input
          id="seriesNumber"
          name="seriesNumber"
          type="number"
          min="1"
          value={exercise.seriesNumber}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="repetitionNumber">Número de repeticiones</Label>
        <Input
          id="repetitionNumber"
          name="repetitionNumber"
          type="number"
          min="1"
          value={exercise.repetitionNumber}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restIntervalSeconds">Descanso entre series (segundos)</Label>
        <Input
          id="restIntervalSeconds"
          name="restIntervalSeconds"
          type="number"
          min="0"
          value={exercise.restIntervalSeconds}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="strokeCount">Número de brazadas por largo</Label>
        <Input
          id="strokeCount"
          name="strokeCount"
          type="number"
          min="0"
          value={exercise.strokeCount}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="efficiency">Eficiencia (opcional)</Label>
        <Input
          id="efficiency"
          name="efficiency"
          type="number"
          step="0.01"
          min="0"
          value={exercise.efficiency}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales</Label>
        <Textarea
          id="notes"
          name="notes"
          value={exercise.notes}
          onChange={handleChange}
          placeholder="Notas específicas para este ejercicio..."
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEditing ? 'Actualizar Ejercicio' : 'Añadir Ejercicio'}
        </Button>
      </div>
    </form>
  );
};

export default ExerciseForm;
