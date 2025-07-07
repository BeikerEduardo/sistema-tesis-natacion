import { Activity, Gauge, CalendarIcon, CheckCircle, XCircle, MapPin, Edit2Icon, ClockIcon, Thermometer, Droplet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Training } from "@/types/training";

export type TrainingDetailMainInfoCardProps = {
  training: Training;
}

const getTrainingTypeColor = (trainingType: string) => {
  switch (trainingType) {
    case 'resistance':
      return 'bg-blue-100 text-blue-800';
    case 'speed':
      return 'bg-red-100 text-red-800';
    case 'technique':
      return 'bg-green-100 text-green-800';
    case 'mixed':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

const getTrainingTypeText = (trainingType: string) => {
  switch (trainingType) {
    case 'resistance':
      return 'Resistencia';
    case 'speed':
      return 'Velocidad';
    case 'technique':
      return 'Técnica';
    case 'mixed':
      return 'Mixto';
    default:
      return 'Otro';
  }
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}


const TrainingDetailMainInfoCard = ({ training }: TrainingDetailMainInfoCardProps) => {
  return (

    <>

      {/* Información principal */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la sesión</CardTitle>
            <CardDescription>
              Información general del entrenamiento programado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">

              <figure className="flex">
                <Activity className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de entrenamiento</p>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${training.trainingType ? getTrainingTypeColor(training.trainingType) : 'bg-gray-100 text-gray-800'}`}>{training.trainingType ? getTrainingTypeText(training.trainingType) : 'Tipo de entrenamiento no especificado'}</span>
                  </div>
                </div>
              </figure>

              <figure className="flex">
                <Gauge className="h-4 w-4 mt-1 mr-2 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <div className="flex items-center mt-1">
                    {training.status === 'completed' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3.5 w-3.5" />
                          Completado
                        </span>
                      )}
                    {training?.status === 'scheduled' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ClockIcon className="mr-1 h-3.5 w-3.5" />
                          Programado
                        </span>
                      )}
                    {training.status === 'cancelled' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Cancelado
                        </span>
                      )}
                  </div>
                </div>
              </figure>

              <figure className="flex">
                <CalendarIcon className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <div className="">
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{training.date}</span>
                  </div>
                </div>
              </figure>
            </div>

            <div className="grid grid-cols-3 gap-4">
              
              <figure className="flex">
                <MapPin className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{training.location}</span>
                  </div>
                </div>
              </figure>

              <figure className="flex">
                <Thermometer className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Temperatura</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{training.temperature} C°</span>
                  </div>
                </div>
              </figure>

              <figure className="flex">
                <Droplet className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Humedad</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{training.humidity} %</span>
                  </div>
                </div>
              </figure>


            </div>
            

            <figure className="flex w-full">
                <Edit2Icon className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground w-full">Descripción</p>
                  <div className="flex items-center mt-1 w-full">
                    <span className="w-full px-2 py-1 rounded-full bg-gray-100 text-gray-800">{training.description}</span>
                  </div>
                </div>
              </figure>


 
          </CardContent>
        </Card>

      </div>
    </>
  )
}

export default TrainingDetailMainInfoCard;