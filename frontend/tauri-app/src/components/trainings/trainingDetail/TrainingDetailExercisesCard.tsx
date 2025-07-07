import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ExercisesTable from "../ExercisesTable"
import { TrainingDetail } from "@/types/trainingDetail";

interface TrainingDetailExercisesCardProps {
    trainingDetails: TrainingDetail[];
}

const TrainingDetailExercisesCard = ({trainingDetails}: TrainingDetailExercisesCardProps)=>{
    return(
        <>
         <Card>
            <CardHeader>
              <CardTitle>Ejercicios</CardTitle>
              <CardDescription>
                Plan de ejercicios para esta sesión
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Depurar los ejercicios disponibles */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Ejercicios disponibles: {trainingDetails?.length || 0}</p>
              </div>

              {/* Convertir los ejercicios del formato TrainingExercise al formato Exercise que espera ExercisesTable */}
              {trainingDetails && trainingDetails.length > 0 ? (
                <ExercisesTable
                  trainingDetails={trainingDetails}
                  onEdit={() => { }} // No necesitamos funcionalidad de edición en la vista de detalle
                  onDelete={() => { }} // No necesitamos funcionalidad de eliminación en la vista de detalle
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay ejercicios registrados para este entrenamiento.
                </div>
              )}
            </CardContent>
          </Card>

        </>
    )
}

export default TrainingDetailExercisesCard;