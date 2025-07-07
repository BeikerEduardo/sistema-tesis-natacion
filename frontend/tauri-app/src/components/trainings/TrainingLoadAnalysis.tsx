import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnalyticsService from '@/services/analytics/analyticsService';
import { LoadVolumeData } from '@/types/analytics';
import { Tabs } from '@radix-ui/react-tabs';

interface TrainingLoadAnalysisProps {
  athleteId?: number;
}

export default function TrainingLoadAnalysis({ athleteId }: TrainingLoadAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [view, setView] = useState<'load' | 'intensity' | 'volume'>('load');
  const [isLoading, setIsLoading] = useState(true);
  const [trainingLoadData, setTrainingLoadData] = useState<LoadVolumeData | null>(null);

  // Cargar datos de carga de entrenamiento
  useEffect(() => {
    const loadTrainingLoadData = async () => {
      setIsLoading(true);
      try {
        const data = await AnalyticsService.getLoadAndVolume(athleteId);
        setTrainingLoadData(data);
      } catch (error) {
        console.error('Error cargando datos de carga de entrenamiento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainingLoadData();
  }, [timeRange, athleteId]);

  // Formatear datos para el gráfico
  const formatChartData = () => {
    if (!trainingLoadData) return [];
    
    /*return trainingLoadData.map(item => ({
      date: new Date(item.week).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      }),
      Carga: item.weeklyDuration,
      Intensidad: item.weeklyIntensity,
      Volumen: item.weeklyVolume,
    }));*/
  };

  const chartData = formatChartData();
  
  // Configuración de colores para las áreas
  const areaConfig = {
    load: {
      dataKey: 'Carga',
      color: 'hsl(220, 70%, 50%)',
      name: 'Carga Total'
    },
    intensity: {
      dataKey: 'Intensidad',
      color: 'hsl(0, 70%, 50%)',
      name: 'Intensidad'
    },
    volume: {
      dataKey: 'Volumen',
      color: 'hsl(120, 70%, 40%)',
      name: 'Volumen (km)'
    }
  };

  const currentView = areaConfig[view];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">Análisis de Carga de Entrenamiento</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={timeRange}
            onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs
            value={view} 
            onValueChange={(value) => setView(value as 'load' | 'intensity' | 'volume')}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="load">Carga</TabsTrigger>
              <TabsTrigger value="intensity">Intensidad</TabsTrigger>
              <TabsTrigger value="volume">Volumen</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentView.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={currentView.color} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                    formatter={(value: number) => [
                      value.toLocaleString('es-ES'),
                      currentView.name
                    ]}
                  />
                  <Legend />
                  
                  <Area
                    type="monotone"
                    dataKey={currentView.dataKey}
                    name={currentView.name}
                    stroke={currentView.color}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard 
          title="Carga semanal promedio" 
          value="4,250" 
          description="+5% vs semana pasada"
          change={5}
          loading={isLoading}
        />
        <MetricCard 
          title="Intensidad promedio" 
          value="7.2/10" 
          description="Nivel óptimo"
          loading={isLoading}
        />
        <MetricCard 
          title="Volumen semanal" 
          value="35 km" 
          description="+2.5 km vs semana pasada"
          change={7.7}
          loading={isLoading}
        />
      </div>
      
      {/* Sección de análisis de fatiga */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análisis de Fatiga y Recuperación</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Basado en los datos de las últimas 4 semanas, el atleta muestra una 
                <span className="font-medium text-foreground"> carga de entrenamiento creciente </span>
                con una buena relación entre volumen e intensidad.
              </p>
              <p className="text-sm text-muted-foreground">
                Se recomienda mantener el volumen actual y enfocarse en la calidad de las sesiones.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-muted-foreground">Estado: Óptimo</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de tarjeta de métrica
interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  change?: number;
  loading?: boolean;
}

function MetricCard({ title, value, description, change, loading = false }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <div className="flex items-center text-xs text-muted-foreground">
            {change !== undefined && (
              <span className={`inline-flex items-center mr-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
            )}
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
