import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PerformanceEvolution from '@/components/analytics/PerformanceEvolution';
import TrainingLoadAnalysis from '@/components/trainings/TrainingLoadAnalysis';
import ConsistencyAnalysis from '@/components/analytics/ConsistencyAnalysis';
import PerformanceAlerts from '@/components/analytics/PerformanceAlerts';
import PhysiologicalData from '@/components/analytics/PhysiologicalData';

export default function Analytics() {
  const { athleteId } = useParams<{ athleteId?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('performance');

  // Verificar si estamos viendo los análisis de un atleta específico o de todos
  const isIndividualView = !!athleteId;

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Aquí podrías cargar datos iniciales si es necesario
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [athleteId]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isIndividualView ? 'Análisis del Atleta' : 'Análisis General'}
          </h1>
          <p className="text-muted-foreground">
            {isIndividualView 
              ? 'Seguimiento detallado del rendimiento y evolución'
              : 'Vista general del rendimiento de todos los atletas'}
          </p>
        </div>
      </div>

      <Tabs 
        defaultValue="performance" 
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="load">Carga de Entrenamiento</TabsTrigger>
          <TabsTrigger value="consistency">Consistencia</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          {isIndividualView && (
            <TabsTrigger value="physiological">Datos Fisiológicos</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceEvolution athleteId={athleteId} />
        </TabsContent>
        
        <TabsContent value="load" className="space-y-4">
          <TrainingLoadAnalysis athleteId={athleteId} />
        </TabsContent>
        
        <TabsContent value="consistency" className="space-y-4">
          <ConsistencyAnalysis athleteId={athleteId} />
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <PerformanceAlerts athleteId={athleteId} />
        </TabsContent>
        
        {isIndividualView && (
          <TabsContent value="physiological" className="space-y-4">
            <PhysiologicalData athleteId={athleteId!} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
