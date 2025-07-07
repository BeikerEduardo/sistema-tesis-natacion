import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// Componente DatePicker
interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
  disabled?: (date: Date) => boolean;
}

const DatePicker = ({ date, setDate, label, disabled }: DatePickerProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={disabled}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Tipo para los datos del formulario
export interface IncidentFormData {
  factorType: 'injury' | 'fatigue' | 'nutrition' | 'sleep' | 'stress' | 'medication' | 'other';
  description: string;
  severity: number;
  startDate: Date;
  endDate?: Date;
  isContinuous: boolean;
  performanceImpact: number;
  notes?: string;
  athleteId?: number;
  trainingId?: number;
}

// Props del componente
interface IncidentFormProps {
  athleteId?: number;
  trainingId?: number;
  onSubmit: (data: IncidentFormData) => void;
  onCancel?: () => void;
}

function IncidentForm({ athleteId, trainingId, onSubmit, onCancel }: IncidentFormProps) {
  // Configurar el formulario con React Hook Form
  const form = useForm<IncidentFormData>({
    defaultValues: {
      factorType: 'other',
      description: '',
      severity: 5,
      startDate: new Date(),
      endDate: new Date(),
      performanceImpact: 0,
      notes: '',
      isContinuous: false,
      athleteId,
      trainingId,
    },
    mode: 'onChange',
  });
  
  // Observar cambios en el campo isContinuous del formulario
  const isContinuous = form.watch("isContinuous");

  // Efecto para actualizar el formulario cuando cambian las props
  useEffect(() => {
    if (athleteId) {
      form.setValue('athleteId', athleteId);
    }
    if (trainingId) {
      form.setValue('trainingId', trainingId);
    }
  }, [athleteId, trainingId, form]);

  // Manejar el envío del formulario
  const handleSubmit = form.handleSubmit((data: IncidentFormData) => {
    // Si es continuo, no enviamos fecha de fin
    if (data.isContinuous) {
      data.endDate = undefined;
    }
    
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="factorType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de factor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de factor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="injury">Lesión</SelectItem>
                  <SelectItem value="fatigue">Fatiga</SelectItem>
                  <SelectItem value="nutrition">Nutrición</SelectItem>
                  <SelectItem value="sleep">Sueño</SelectItem>
                  <SelectItem value="stress">Estrés</SelectItem>
                  <SelectItem value="medication">Medicación</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe el factor externo..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severidad</FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Baja</span>
                  <span className="text-xs">Alta</span>
                </div>
                <Slider
                  defaultValue={[field.value]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
                <div className="text-center">
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={(date) => date && field.onChange(date)}
                    label="Fecha de inicio"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="isContinuous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 h-10 mb-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mr-2"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">
                    Factor continuo (sin fecha de fin)
                  </FormLabel>
                </FormItem>
              )}
            />

            {!isContinuous && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => date && field.onChange(date)}
                        label="Fecha de fin"
                        disabled={(date) => date < form.getValues().startDate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <Controller
          control={form.control}
          name="performanceImpact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impacto en el rendimiento</FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Negativo (-10)</span>
                  <span className="text-xs">Positivo (+10)</span>
                </div>
                <Slider
                  defaultValue={[field.value]}
                  min={-10}
                  max={10}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
                <div className="text-center">
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas adicionales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas adicionales sobre el factor externo..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}

export default IncidentForm;
