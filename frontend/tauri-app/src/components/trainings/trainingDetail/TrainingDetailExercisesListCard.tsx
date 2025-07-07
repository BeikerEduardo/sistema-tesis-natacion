import { TrainingDetail } from "@/types/trainingDetail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import ExercisesTable from "../ExercisesTable";

export type TrainingDetailExercisesListCardProps = {
    exercises: TrainingDetail[];
}

const TrainingDetailExercisesListCard = ({exercises}: TrainingDetailExercisesListCardProps)=>{
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
                <p className="text-sm text-muted-foreground">Ejercicios disponibles: {exercises?.length || 0}</p>
              </div>

              {/* Convertir los ejercicios del formato Exercise al formato TrainingDetail que espera ExercisesTable */}
              {exercises && exercises.length > 0 ? (
                <ExercisesTable
                  trainingDetails={exercises}
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

export default TrainingDetailExercisesListCard;