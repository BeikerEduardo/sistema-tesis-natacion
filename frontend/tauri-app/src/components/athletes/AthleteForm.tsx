import React from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAthletes } from '@/hooks/useAthletes';
import AthleteError from '@/components/athletes/AthleteError';
import toast from 'react-hot-toast';

export interface AthleteFormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  category: string;
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
}

interface AthleteFormProps {
  isEditing?: boolean;
  defaultValues?: Partial<AthleteFormData>;
}

export const AthleteForm = ({ isEditing = false, defaultValues }: AthleteFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    createAthlete,
    updateAthlete,
    useAthlete,
    isCreating,
    isUpdating,
    createMutation,
    updateMutation
  } = useAthletes();

  // Obtener datos del atleta si estamos en modo edición
  const {
    data: existingAthlete,
    isLoading: isLoadingAthlete,
    error: athleteError
  } = id ? useAthlete(Number(id)) : { data: null, isLoading: false, error: null };

  // Determinar si estamos cargando (cargando datos o en proceso de envío)
  const isProcessing = isLoadingAthlete || isCreating || isUpdating || createMutation?.isPending || updateMutation?.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
    reset,
  } = useHookForm<AthleteFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: new Date().toISOString().split('T')[0],
      category: '',
      height: 170,
      weight: 60,
      gender: 'male',
      phone: ''
    },
    mode: 'onChange',
  });

  // Set form values when existingAthlete loads or when the component mounts/unmounts
  React.useEffect(() => {
    if (existingAthlete && isEditing) {
      // Asegurarse de que category y gender siempre tengan valores válidos
      const categoryValue = existingAthlete.category || '';
      const genderValue = existingAthlete.gender || 'male';

      // Usar setValue para cada campo individual para mejor control
      setValue('firstName', existingAthlete.firstName || '');
      setValue('lastName', existingAthlete.lastName || '');
      setValue('email', existingAthlete.email || '');
      setValue('dateOfBirth', existingAthlete.dateOfBirth || new Date().toISOString().split('T')[0]);
      setValue('category', existingAthlete.category || '');
      setValue('height', existingAthlete.height || 170);
      setValue('weight', existingAthlete.weight || 60);
      setValue('gender', existingAthlete.gender || 'male');
      setValue('phone', existingAthlete.phone || '');
    }

    // Cleanup function to ensure form state is reset when component unmounts
    return () => {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: new Date().toISOString().split('T')[0],
        category: '',
        height: 170,
        weight: 60,
        gender: 'male',
        phone: ''
      });
    };
  }, [existingAthlete, isEditing, setValue, reset]);

  const onSubmit = async (data: AthleteFormData) => {
    try {
      // Convertir la fecha de nacimiento al formato esperado por el backend
      const athleteData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0]
      };

      if (isEditing && id) {
        await updateAthlete({ id: Number(id), ...athleteData });
        toast.success('Atleta actualizado correctamente');
        navigate('/athletes');
      } else {
        await createAthlete(athleteData);
        toast.success('Atleta creado correctamente');
        setTimeout(() => navigate('/athletes'), 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error al guardar el atleta');
    }
  };

  if (isLoadingAthlete) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Mostrar error si hay un problema al cargar el atleta
  if (athleteError) {
    return (
      <AthleteError athleteError={athleteError} />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl p-6 bg-card rounded-lg shadow-sm">

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Editar Atleta' : 'Nuevo Atleta'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Actualiza la información del atleta.'
              : 'Completa el formulario para registrar un nuevo atleta.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              placeholder="Ej: Juan"
              {...register('firstName', { required: 'El nombre es requerido' })}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              placeholder="Ej: Pérez"
              {...register('lastName', { required: 'El apellido es requerido' })}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@email.com"
              {...register('email', {
                required: 'El correo es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido',
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              onValueChange={(value) => {
                setValue('category', value);
              }}
              value={watch('category')}
              defaultValue={existingAthlete?.category || ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pre-Infantil">Pre-Infantil (6-8 años)</SelectItem>
                <SelectItem value="Infantil">Infantil (9-10 años)</SelectItem>
                <SelectItem value="Pre-Juvenil">Pre-Juvenil (11-12 años)</SelectItem>
                <SelectItem value="Juvenil">Juvenil (13-14 años)</SelectItem>
                <SelectItem value="Junior">Junior (15-17 años)</SelectItem>
                <SelectItem value="Senior">Senior (18+ años)</SelectItem>
                <SelectItem value="Máster">Máster (25+ años)</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+56 9 1234 5678"
              {...register('phone', {
                required: 'El teléfono es requerido',
              })}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
            <Input
              id="dateOfBirth"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('dateOfBirth', {
                required: 'La fecha de nacimiento es requerida',
              })}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="height">Estatura (cm)</Label>
            <Input
              id="height"
              type="number"
              min="0"
              step="0.1"
              {...register('height', {
                required: 'La estatura es requerida',
                valueAsNumber: true,
                min: { value: 0, message: 'La estatura debe ser mayor a 0' },
              })}
            />
            {errors.height && (
              <p className="text-sm text-red-500">{errors.height.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              {...register('weight', {
                required: 'El peso es requerido',
                valueAsNumber: true,
                min: { value: 0, message: 'El peso debe ser mayor a 0' },
              })}
            />
            {errors.weight && (
              <p className="text-sm text-red-500">{errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Género</Label>
            <Select
              onValueChange={(value) => {
                setValue('gender', value as 'male' | 'female' | 'other');
              }}
              value={watch('gender')}
              defaultValue={existingAthlete?.gender || 'male'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione un género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Femenino</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

        </div>



        <div className="space-y-2">

          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex space-x-3">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isProcessing || isSubmitting}
              >
                {(isProcessing || isSubmitting) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : isEditing ? (
                  'Actualizar Atleta'
                ) : (
                  'Crear Atleta'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => navigate('/athletes', { replace: true })}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
