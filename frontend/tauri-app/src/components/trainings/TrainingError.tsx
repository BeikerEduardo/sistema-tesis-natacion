import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


const TrainingError = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
                <h3 className="font-semibold">Error al cargar el entrenamiento</h3>
                <p className="text-muted-foreground">No se pudo obtener la información del entrenamiento.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/trainings')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a entrenamientos
            </Button>
        </div>
    );
};
export default TrainingError;