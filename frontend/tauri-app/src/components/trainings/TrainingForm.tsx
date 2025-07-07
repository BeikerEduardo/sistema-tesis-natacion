// @ts-ignore - Ignorar errores de importación
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Clock, Loader2, Plus, Thermometer, Droplets, CloudRain, HeartPulse, Weight, Wind, User } from 'lucide-react';
import { ExerciseForm } from '@/components/trainings/ExerciseForm';
import { ExercisesTable } from '@/components/trainings/ExercisesTable';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Training, TrainingIntensity, TrainingUpdate, TrainingCreate } from '@/types/training';
import type {TrainingDetail} from "@/types/trainingDetail";
import type {Athlete} from "@/types/athlete";
import trainingsService from '@/services/trainings/trainingsService';
import athletesService from '@/services/athletes/athletesService';
import { useTrainings } from '@/hooks/useTrainings';
import { v4 as uuid, v4 } from 'uuid';


interface TrainingFormProps {
  isEditing?: boolean;
  defaultValues?: Training;
  trainingId?: number;
  onSuccess?: () => void;
  isSubmitting?: boolean;
}

export const TrainingForm = ({ 
  isEditing = false, 
  defaultValues, 
  trainingId,
  onSuccess 
}: TrainingFormProps) => {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoadingAthletes, setIsLoadingAthletes] = useState(false);
  
  // Obtener las funciones de mutación del hook useTrainings
  // Usamos solo las funciones de mutación que necesitamos
  const { createTrainingMutation, updateTrainingMutation } = useTrainings();
  
  // Cargar la lista de atletas
  useEffect(() => {
    const loadAthletes = async () => {
      setIsLoadingAthletes(true);
      try {
        const athletesList = await athletesService.getAllAthletes();
        setAthletes(athletesList);
      } catch (error) {
        console.error('Error al cargar atletas:', error);
        toast.error('No se pudieron cargar los atletas');
      } finally {
        setIsLoadingAthletes(false);
      }
    };
    
    loadAthletes();
  }, []);
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<Training>({
    mode: 'onChange',
    defaultValues: {
      // Inicializamos con un array vacío de ejercicios
      details: defaultValues?.details || [],
      date: defaultValues?.date,
      startTime: defaultValues?.startTime,
      endTime: defaultValues?.endTime,
      title: defaultValues?.title,
      description: defaultValues?.description,
      location: defaultValues?.location,
      notes: defaultValues?.notes || '',
      trainingType: defaultValues?.trainingType || 'other',
      durationMinutes: defaultValues?.durationMinutes,
      isOutdoor: defaultValues?.isOutdoor || false,
      temperature: defaultValues?.temperature,
      humidity: defaultValues?.humidity,
      weatherCondition: defaultValues?.weatherCondition,
      athleteId: defaultValues?.athleteId,
      coachId: defaultValues?.coachId,
      heartRateRest: defaultValues?.heartRateRest,
      heartRateDuring: defaultValues?.heartRateDuring,
      heartRateAfter: defaultValues?.heartRateAfter,
      weightBefore: defaultValues?.weightBefore,
      weightAfter: defaultValues?.weightAfter,
      breathingPattern: defaultValues?.breathingPattern,
      physicalStateRating: defaultValues?.physicalStateRating,
      painReported: defaultValues?.painReported,
      swimsuitType: defaultValues?.swimsuitType,
      equipmentUsed: defaultValues?.equipmentUsed,
      status: defaultValues?.status,
    },
  });
  
  // Log para depuración
  useEffect(() => {
    if (isEditing && defaultValues) {
      console.log('TrainingForm defaultValues:', defaultValues);
      if (defaultValues.details) {
        console.log('Details data:', defaultValues.details);
      }
      
      // Verificar si hay detalles en el objeto original usando acceso seguro
      if ((defaultValues as any).details) {
        console.log('Training details found:', (defaultValues as any).details);
      }
      
      // Verificar si hay trainingDetails en el objeto original usando acceso seguro
      if ((defaultValues as any).trainingDetails) {
        console.log('Training trainingDetails found:', (defaultValues as any).trainingDetails);
      }
      
      // Inspeccionar el objeto completo para ver todas las propiedades
      console.log('All properties in defaultValues:', Object.keys(defaultValues));
    }
  }, [isEditing, defaultValues]);
  
  // Asegurar que los ejercicios tengan todos los campos necesarios
  useEffect(() => {
    if (isEditing && defaultValues?.details?.length) {
      const completeExercises = defaultValues.details.map(det => ({
        id: det.id,
        distance: det.distance,
        swimStyle: det.swimStyle,
        timeSeconds: det.timeSeconds,
        seriesNumber: det.seriesNumber,
        repetitionNumber: det.repetitionNumber,
        restIntervalSeconds: det.restIntervalSeconds || 0,
        strokeCount: det.strokeCount || 0,
        efficiency: det.efficiency || 0,
        notes: det.notes || ''
      }));
      
      console.log('Setting complete exercises:', completeExercises);
      setValue('details', completeExercises);
    }
  }, [isEditing, defaultValues, setValue]);

  const exercises = watch('details') || [];
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<TrainingDetail | null>(null);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);

  const openAddExerciseModal = () => {
    setCurrentExercise(null);
    setEditingExerciseIndex(null);
    setIsExerciseModalOpen(true);
  };

  const openEditExerciseModal = (exercise: TrainingDetail, index: number) => {
    setCurrentExercise(exercise);
    setEditingExerciseIndex(index);
    setIsExerciseModalOpen(true);
  };

  const closeExerciseModal = () => {
    setIsExerciseModalOpen(false);
    setCurrentExercise(null);
    setEditingExerciseIndex(null);
  };

  const handleSaveExercise = (exerciseData: Omit<TrainingDetail, 'id'>) => {
    if (editingExerciseIndex !== null && currentExercise) {
      // Editing existing exercise
      const newExercises = [...exercises];
      newExercises[editingExerciseIndex] = {
        ...exerciseData,
        id: currentExercise.id
      };
      setValue('details', newExercises);
    } else {
      // Adding new exercise
      // Use a temporary negative ID for new exercises (will be replaced by the server)
      const newExercise = { 
        ...exerciseData,
        id: v4()// Use timestamp as temporary ID
      };
      setValue('details', [...exercises, newExercise]);
    }
    closeExerciseModal();
  };

  const removeExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setValue('details', newExercises);
  };

  // Observar cambios en el campo isOutdoor
  const watchIsOutdoor = watch('isOutdoor');

  const onSubmit = async (formData: Training) => {
    try {
      const baseData = {
        title: formData.title || 'Nuevo Entrenamiento',
        description: formData.description || '',
        date: formData.date,
        startTime: formData.startTime || '09:00',
        endTime: formData.endTime || '10:00',
        location: formData.location || '',
        trainingType: formData.trainingType || 'mixed',
        status: formData.status || 'scheduled',
        notes: formData.notes || '',
        details: formData.details?.map(det => ({
          ...det,
          distance: det.distance || 0,
          swimStyle: det.swimStyle || 'freestyle',
          timeSeconds: det.timeSeconds || 0,
          seriesNumber: det.seriesNumber || 1,
          repetitionNumber: det.repetitionNumber || 1,
          restIntervalSeconds: det.restIntervalSeconds || 0,
          strokeCount: det.strokeCount || 0,
          efficiency: det.efficiency || 0,
          notes: det.notes || ''
        }))
      };

      // Prepare complete data including all fields
      const completeData = {
        ...baseData,
        durationMinutes: formData.durationMinutes || 60,
        isOutdoor: formData.isOutdoor || false,
        temperature: formData.temperature,
        humidity: formData.humidity,
        weatherCondition: formData.weatherCondition,
        heartRateRest: formData.heartRateRest,
        heartRateDuring: formData.heartRateDuring,
        heartRateAfter: formData.heartRateAfter,
        weightBefore: formData.weightBefore,
        weightAfter: formData.weightAfter,
        breathingPattern: formData.breathingPattern || '',
        physicalStateRating: formData.physicalStateRating,
        painReported: formData.painReported ? String(formData.painReported) : null,
        swimsuitType: formData.swimsuitType || '',
        equipmentUsed: formData.equipmentUsed || '',
        athleteId: formData.athleteId || 1, // Valor temporal, debe ser reemplazado con un selector de atletas
        coachId: formData.coachId || 1, // Valor temporal, debe ser reemplazado con el ID del entrenador actual
        // Asegurarse de incluir todos los campos necesarios
        location: formData.location || '',
        description: formData.description || '',
        status: formData.status || 'scheduled'
      };
      
      try {
        if (isEditing && trainingId) {
          // Para actualización, necesitamos pasar el ID y los datos por separado
          // La estructura esperada es { id: number, data: TrainingUpdate }
          await updateTrainingMutation.mutateAsync({
            id: trainingId,
            data: {
              ...completeData,
              id: trainingId
            }
          });
          // Los toasts se manejan en el hook useTrainings
        } else {
          // Para creación, pasamos directamente los datos como TrainingCreate
          await createTrainingMutation.mutateAsync(completeData as unknown as TrainingCreate);
          // Los toasts se manejan en el hook useTrainings
        }
      } catch (error) {
        console.error('Error al guardar el entrenamiento:', error);
        toast.error('Ocurrió un error al guardar el entrenamiento. Por favor, inténtalo de nuevo.');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Navegar a la lista de entrenamientos después de 1 segundo
        setTimeout(() => {
          navigate('/trainings');
        }, 1000);
      }
    } catch (error) {
      console.error('Error al guardar el entrenamiento:', error);
      toast.error('Ocurrió un error al guardar el entrenamiento. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Modal para añadir/editar ejercicios - Movido fuera del formulario */}
      <Dialog open={isExerciseModalOpen} onOpenChange={setIsExerciseModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingExerciseIndex !== null ? 'Editar Ejercicio' : 'Añadir Nuevo Ejercicio'}
            </DialogTitle>
          </DialogHeader>
          <ExerciseForm
            onSave={handleSaveExercise}
            onCancel={closeExerciseModal}
            defaultValues={currentExercise || undefined}
            isEditing={editingExerciseIndex !== null}
          />
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información General</h3>
          
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ej: Entrenamiento de resistencia"
              {...register('title', { required: 'El título es obligatorio' })}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'El estado es obligatorio' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Programado</SelectItem>
                      <SelectItem value="in-progress">En progreso</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainingType">Tipo de entrenamiento *</Label>
              <Controller
                name="trainingType"
                control={control}
                rules={{ required: 'El tipo de entrenamiento es obligatorio' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resistance">Resistencia</SelectItem>
                      <SelectItem value="speed">Velocidad</SelectItem>
                      <SelectItem value="technique">Técnica</SelectItem>
                      <SelectItem value="mixed">Mixto</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.trainingType && (
                <p className="text-sm text-red-500">{errors.trainingType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="athleteId">
                <User className="h-4 w-4 inline mr-1" /> Atleta
              </Label>
              <Controller
                name="athleteId"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value?.toString() || ""}
                    disabled={isLoadingAthletes}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un atleta" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingAthletes ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cargando atletas...
                          </div>
                        </SelectItem>
                      ) : athletes.length > 0 ? (
                        athletes.map((athlete) => (
                          <SelectItem key={athlete.id} value={athlete.id.toString()}>
                            {athlete.firstName} {athlete.lastName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-athletes" disabled>
                          No hay atletas disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Objetivos del entrenamiento..."
              {...register('description')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha *</Label>
            {/* @ts-ignore - Ignorar errores de tipo */}
            <Controller
              name="date"
              control={control}
              render={({ field }: any) => {
                const { onChange, value } = field;
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="inline-block">
                        <Button
                          type="button"
                          variant="outline"
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? (
                          (() => {
                            try {
                              const date = new Date(value);
                              if (isNaN(date.getTime())) {
                                return <span>Fecha inválida</span>;
                              }
                              return format(date, 'PPP');
                            } catch (error) {
                              console.error('Error formatting date:', error);
                              return <span>Fecha inválida</span>;
                            }
                          })()
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            onChange(selectedDate);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de inicio *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  className="pl-10"
                  {...register('startTime', { required: 'La hora de inicio es obligatoria' })}
                />
              </div>
              {errors.startTime && (
                <p className="text-sm text-red-500 mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de término *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  className="pl-10"
                  {...register('endTime', { required: 'La hora de término es obligatoria' })}
                />
              </div>
              {errors.endTime && (
                <p className="text-sm text-red-500 mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              placeholder="Ej: Piscina Municipal"
              {...register('location')}
            />
          </div>
        </div>

        {/* Ejercicios */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Ejercicios</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openAddExerciseModal}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Ejercicio
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <ExercisesTable 
              trainingDetails={exercises} 
              onEdit={openEditExerciseModal} 
              onDelete={removeExercise} 
            />
          </div>
        </div>

        {/* Datos Fisiológicos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Datos Fisiológicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRateRest">
                <HeartPulse className="h-4 w-4 inline mr-1" /> Frecuencia Cardíaca en Reposo
              </Label>
              <Input
                id="heartRateRest"
                type="number"
                placeholder="BPM"
                {...register('heartRateRest', {
                  valueAsNumber: true,
                  validate: value => !value || (value >= 40 && value <= 200) || 'Valor fuera de rango (40-200)'
                })}
              />
              {errors.heartRateRest && (
                <p className="text-sm text-red-500">{errors.heartRateRest.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heartRateDuring">
                <HeartPulse className="h-4 w-4 inline mr-1" /> Frecuencia Cardíaca Durante
              </Label>
              <Input
                id="heartRateDuring"
                type="number"
                placeholder="BPM"
                {...register('heartRateDuring', {
                  valueAsNumber: true,
                  validate: value => !value || (value >= 60 && value <= 220) || 'Valor fuera de rango (60-220)'
                })}
              />
              {errors.heartRateDuring && (
                <p className="text-sm text-red-500">{errors.heartRateDuring.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heartRateAfter">
                <HeartPulse className="h-4 w-4 inline mr-1" /> Frecuencia Cardíaca Después
              </Label>
              <Input
                id="heartRateAfter"
                type="number"
                placeholder="BPM"
                {...register('heartRateAfter', {
                  valueAsNumber: true,
                  validate: value => !value || (value >= 40 && value <= 200) || 'Valor fuera de rango (40-200)'
                })}
              />
              {errors.heartRateAfter && (
                <p className="text-sm text-red-500">{errors.heartRateAfter.message as string}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightBefore">
                <Weight className="h-4 w-4 inline mr-1" /> Peso Antes (kg)
              </Label>
              <Input
                id="weightBefore"
                type="number"
                step="0.1"
                placeholder="kg"
                {...register('weightBefore', {
                  valueAsNumber: true,
                  validate: value => !value || (value > 0 && value < 200) || 'Peso inválido'
                })}
              />
              {errors.weightBefore && (
                <p className="text-sm text-red-500">{errors.weightBefore.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weightAfter">
                <Weight className="h-4 w-4 inline mr-1" /> Peso Después (kg)
              </Label>
              <Input
                id="weightAfter"
                type="number"
                step="0.1"
                placeholder="kg"
                {...register('weightAfter', {
                  valueAsNumber: true,
                  validate: value => !value || (value > 0 && value < 200) || 'Peso inválido'
                })}
              />
              {errors.weightAfter && (
                <p className="text-sm text-red-500">{errors.weightAfter.message as string}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Factores de Rendimiento */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Factores de Rendimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breathingPattern">
                <Wind className="h-4 w-4 inline mr-1" /> Patrón de Respiración
              </Label>
              <Input
                id="breathingPattern"
                placeholder="Ej: Cada 3 brazadas"
                {...register('breathingPattern')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="physicalStateRating">Valoración Estado Físico (1-10)</Label>
              <Input
                id="physicalStateRating"
                type="number"
                min="1"
                max="10"
                {...register('physicalStateRating', {
                  valueAsNumber: true,
                  validate: value => !value || (value >= 1 && value <= 10) || 'Valor debe estar entre 1 y 10'
                })}
              />
              {errors.physicalStateRating && (
                <p className="text-sm text-red-500">{errors.physicalStateRating.message as string}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="painReported">Dolor Reportado</Label>
            <Textarea
              id="painReported"
              placeholder="Descripción de dolor o molestias (área y intensidad)"
              {...register('painReported')}
              rows={2}
            />
          </div>
        </div>
        
        {/* Equipamiento */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Equipamiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="swimsuitType">Tipo de Traje</Label>
              <Input
                id="swimsuitType"
                placeholder="Ej: Jammer, Traje de competición"
                {...register('swimsuitType')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipmentUsed">Equipamiento Utilizado</Label>
              <Input
                id="equipmentUsed"
                placeholder="Ej: Aletas, palas, pull buoy"
                {...register('equipmentUsed')}
              />
            </div>
          </div>
        </div>
        
        {/* Condiciones Climáticas (solo para entrenamientos al aire libre) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOutdoor"
              defaultChecked={defaultValues?.isOutdoor || false}
              {...register('isOutdoor')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="isOutdoor">Entrenamiento al aire libre</Label>
          </div>
          
          {watchIsOutdoor && (
            <div className="border rounded-lg p-4 mt-2">
              <h4 className="text-md font-medium mb-3">Condiciones Climáticas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">
                    <Thermometer className="h-4 w-4 inline mr-1" /> Temperatura (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="°C"
                    {...register('temperature', {
                      valueAsNumber: true,
                      validate: value => !value || (value >= -20 && value <= 50) || 'Temperatura fuera de rango'
                    })}
                  />
                  {errors.temperature && (
                    <p className="text-sm text-red-500">{errors.temperature.message as string}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="humidity">
                    <Droplets className="h-4 w-4 inline mr-1" /> Humedad (%)
                  </Label>
                  <Input
                    id="humidity"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="%"
                    {...register('humidity', {
                      valueAsNumber: true,
                      validate: value => !value || (value >= 0 && value <= 100) || 'Humedad debe estar entre 0% y 100%'
                    })}
                  />
                  {errors.humidity && (
                    <p className="text-sm text-red-500">{errors.humidity.message as string}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weatherCondition">
                    <CloudRain className="h-4 w-4 inline mr-1" /> Condición Climática
                  </Label>
                  <select
                    id="weatherCondition"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('weatherCondition')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="sunny">Soleado</option>
                    <option value="cloudy">Nublado</option>
                    <option value="rainy">Lluvioso</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4 pt-4">
          <Label htmlFor="notes">Notas Adicionales</Label>
          <Textarea
            id="notes"
            placeholder="Otras observaciones importantes..."
            {...register('notes')}
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/trainings')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? 'Actualizar Entrenamiento' : 'Crear Entrenamiento'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TrainingForm;
