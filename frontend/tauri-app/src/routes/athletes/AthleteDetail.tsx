import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Athlete } from '@/types/athlete';
import athletesService from '@/services/athletes/athletesService';
//import { getPerformanceAlerts } from '@/services/analytics/analyticsService';
import type { PerformanceAlert } from '@/types/analytics';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Activity,
  BarChart2,
  CalendarDays,
  Ruler,
  Scale,
  Venus,
  Mars,
  User,
  Mail,
  Phone
} from 'lucide-react';
import AthleteResumeTabContent from '@/components/athletes/AthleteResumeTabContent';
import AthletePerformanceTabContent from '@/components/athletes/AthletePerformanceTabContent';
import AthleteAnalyticsTabContent from '@/components/athletes/AthleteAnalyticsTabContent';
import AthleteTrainingsTabContent from '@/components/athletes/AthleteTrainingsTabContent';
import PerformanceAlerts from '@/components/analytics/PerformanceAlerts';


const AthleteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Obtener los datos del atleta
  const { data: athlete, isLoading, error } = useQuery<Athlete>({
    queryKey: ['athlete', id],
    queryFn: () => athletesService.getAthlete(Number(id!)),
    enabled: !!id,
  });

  // Obtener alertas de rendimiento
  {/* 
    const { data: alertsData, isLoading: isLoadingAlerts, error: alertsError } = useQuery<PerformanceAlertItem[]>({
    queryKey: ['athlete-alerts', id],
    queryFn: async () => {
      console.log(`Fetching alerts for athlete ID: ${id}`);
      // Asegurarse de que el ID se pasa como string
      //const alerts = await athletesService.getPerformanceAlerts(Number(id!));
      console.log('Alerts fetched:', alerts);
      return alerts;
    },
    enabled: !!id,
    // Refetch cada 5 minutos y cuando el componente vuelva a estar en foco
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
    */}

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
    
  
  // Función para formatear la fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  

  if (isLoading) {
    return <PageLoader text="Cargando información del atleta..." />;
  }

  if (error || !athlete) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error al cargar los datos del atleta. Por favor, inténtalo de nuevo.
      </div>
    );
  }

  // Calcular iniciales para el avatar
  const initials = `${athlete.firstName[0]}${athlete.lastName[0]}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {athlete.firstName} {athlete.lastName}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/athletes/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Tarjeta de perfil */}
        <Card className="md:col-span-1">
          <CardHeader className="items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">
              {athlete.firstName} {athlete.lastName}
            </CardTitle>
            <CardDescription>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {athlete.category}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Información de contacto</h3>
              <div className="space-y-2 pl-1">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-blue-400" />
                  <a href={`mailto:${athlete.email}`} className="hover:underline hover:text-blue-500">
                    {athlete.email}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  <a href={`tel:${athlete.phone}`} className="hover:underline hover:text-green-500">
                    {athlete.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Detalles</h3>
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                {calculateAge(athlete.dateOfBirth)} años
              </div>
              <div className="flex items-center text-sm">
                {athlete.gender === 'male' ? (
                  <Mars className="h-4 w-4 mr-2 text-blue-500" />
                ) : athlete.gender === 'female' ? (
                  <Venus className="h-4 w-4 mr-2 text-pink-500" />
                ) : (
                  <User className="h-4 w-4 mr-2 text-purple-500" />
                )}
                {athlete.gender === 'male' ? 'Masculino' :
                  athlete.gender === 'female' ? 'Femenino' : 'Otro'}
              </div>
              <div className="flex items-center text-sm">
                <Ruler className="h-4 w-4 mr-2 text-green-500" />
                {athlete.height} cm
              </div>
              <div className="flex items-center text-sm">
                <Scale className="h-4 w-4 mr-2 text-amber-500" />
                {athlete.weight} kg
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección principal */}
        <div className="md:col-span-3 space-y-4">
          <Tabs defaultValue="trainings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trainings">
                <Calendar className="mr-2 h-4 w-4" />
                Entrenamientos
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart2 className="mr-2 h-4 w-4" />
                Análisis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trainings">
              <AthleteTrainingsTabContent/>
            </TabsContent>

            <TabsContent value="analytics">
              <AthleteAnalyticsTabContent athleteId={Number(id)}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AthleteDetail;
