import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Edit, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { IncidentFormData } from "./IncidentForm";
import { Training, TrainingStatus } from "@/types/training";
import TrainingDetailReportExternalFactorDialog from "./TrainingDetailReportExternalFactorDialog";
import ChangeTrainingStatusModal from "./ChangeTrainingStatusModal";

interface TrainingDetailQuickActionsCardProps {
    training: Training;
    onCreateIncident: (data: IncidentFormData) => void;
    onCancelIncident: () => void;
    onOpenCompleteDialog: () => void;
    onOpenCancelDialog: () => void;
    statusDialogOpen: boolean;
    setStatusDialogOpen: (open: boolean) => void;
    handleStatusDialogClose: () => void;
    handleStatusChange: () => void;
    pendingStatus: TrainingStatus;
}

const TrainingDetailQuickActionsCard = ({ 
    training, 
    onCreateIncident, 
    onCancelIncident, 
    onOpenCompleteDialog,
    onOpenCancelDialog,
    statusDialogOpen,
    setStatusDialogOpen,
    handleStatusDialogClose,
    handleStatusChange,
    pendingStatus
}: TrainingDetailQuickActionsCardProps) => {
    return (
        <>
            {/* Acciones rápidas*/}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Link to={`/trainings/${training.id}/edit`} className="w-full block">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar ejercicios
                        </Button>
                    </Link>
                    {/* Botón para reportar incidencia */}
                    <div className="w-full">
                        <TrainingDetailReportExternalFactorDialog 
                            onSubmit={onCreateIncident}
                            onCancel={onCancelIncident}
                        />

                    </div>
                    {
                        training?.status !== 'completed' && (
                            <Button
                                variant="outline"
                                className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={onOpenCompleteDialog}
                            >
                                <CheckCircle className="mr-2 h-4 w-4"/>
                                Marcar como completado
                            </Button>
                        )
                    }

                    {training?.status !== 'cancelled' && training?.status !== 'completed' && (
                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={onOpenCancelDialog}
                        >
                            <XCircle className="mr-2 h-4 w-4"/>
                            Cancelar sesión
                        </Button>
                    )}

                    <ChangeTrainingStatusModal
                        statusDialogOpen={statusDialogOpen}
                        setStatusDialogOpen={setStatusDialogOpen}
                        handleStatusDialogClose={handleStatusDialogClose}
                        handleStatusChange={handleStatusChange}
                        pendingStatus={pendingStatus}
                    />

                </CardContent>
            </Card>
        </>
    );
}

export default TrainingDetailQuickActionsCard;