import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Activity, Users, Calendar, AlertTriangle, Check, X, Clock } from "lucide-react";
import useDashboardMetrics from '@/hooks/useDashboardMetrics';

const translateStatus = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'scheduled':
      return 'Programado';
    case 'cancelled':
      return 'Cancelado';
    case "in-progress":
      return 'En progreso';
    default:
      return 'Desconocido';
  }
};

const translateExternalFactorType = (type: string) => {
  switch (type) {
    case 'injury':
      return 'Lesión';
    case 'fatigue':
      return 'Fatiga';
    case 'sleep':
      return 'Dormir';
    case 'nutrition':
      return 'Nutrición';
    case 'stress':
      return 'Estrés';
    case 'medication':
      return 'Medicación';
    case 'other':
      return 'Otro';
    default:
      return 'Desconocido';
  }
};

const getStatusIcon = (status: string): React.ElementType => {
  switch (status) {
    case 'completed':
      return Check;
    case 'scheduled':
      return Calendar;
    case 'cancelled':
      return X;
    case "in-progress":
      return Clock;
    default:
      return AlertCircle;
  }
};

// Componente para mostrar una métrica individual
const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  iconColor 
}: { 
  title: string; 
  value: string | number; 
  description?: string; 
  icon: React.ElementType;
  iconColor?: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para mostrar una métrica en estado de carga
const MetricCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-2" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { metrics, isLoading, isError, error, refetch } = useDashboardMetrics();

  useEffect(() => {
    // Cargar métricas al montar el componente
    refetch();
  }, [refetch]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vista General</h2>
      </div>
      
      {isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'No se pudieron cargar las métricas del dashboard'}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Estadísticas rápidas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </>
            ) : (
              <>
                <MetricCard
                  title="Total Atletas"
                  value={metrics?.totalAthletes || 0}
                  icon={Users}
                  iconColor="text-green-500"
                />
                <MetricCard
                  title="Total Entrenamientos"
                  value={metrics?.totalTrainings || 0}
                  icon={Calendar}
                  iconColor="text-blue-500"
                />
                <MetricCard
                  title="Incidencias Reportadas"
                  value={metrics?.totalIncidents || 0}
                  icon={AlertTriangle}
                  iconColor="text-red-500"
                />
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Entrenamientos por Estado</CardTitle>
                <CardDescription>
                  Distribución de entrenamientos según su estado actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {metrics?.trainingsByStatus && Object.entries(metrics.trainingsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <figure className={`mr-2 ${status === 'completed' ? 'text-green-500' :
                            status === 'scheduled' ? 'text-blue-500' :
                            status === 'cancelled' ? 'text-red-500' :
                            status === 'in-progress' ? 'text-yellow-500' :
                            'text-gray-500'}`}>
                            {React.createElement(getStatusIcon(status))}
                          </figure>
                          <span className="capitalize">{translateStatus(status)}</span>
                        </div>
                        <span className='font-semibold'>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incidencias por Tipo</CardTitle>
                <CardDescription>
                  Distribución de incidencias reportadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {metrics?.incidentsByType && Object.entries(metrics.incidentsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${
                            type === 'injury' ? 'bg-blue-500' :
                            type === 'fatigue' ? 'bg-orange-500' :
                            type === 'sleep' ? 'bg-purple-500' :
                            type === 'nutrition' ? 'bg-red-500' :
                            type === 'stress' ? 'bg-yellow-500' :
                            type === 'medication' ? 'bg-green-500' :
                            type === 'other' ? 'bg-gray-500' :
                            'bg-gray-500'
                          }`} />
                          <span className="capitalize">{translateExternalFactorType(type)}</span>
                        </div>
                        <span className='font-semibold'>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Dashboard;