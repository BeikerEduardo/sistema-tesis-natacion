import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";

export type ChangeTrainingStatusModalProps = {
    statusDialogOpen: boolean;
    setStatusDialogOpen: (open: boolean) => void;
    handleStatusDialogClose: () => void;
    handleStatusChange: () => void;
    pendingStatus: string;
}


const ChangeTrainingStatusModal: React.FC<ChangeTrainingStatusModalProps> = ({
    statusDialogOpen,
    setStatusDialogOpen,
    handleStatusDialogClose,
    handleStatusChange,
    pendingStatus,
}) => {
    return (
        <>
            {/* Diálogo de confirmación para cambiar estado */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            <DialogTitle>Confirmar acción</DialogTitle>
                        </div>
                        <DialogDescription>
                            {pendingStatus === 'completed'
                                ? '¿Estás seguro de marcar este entrenamiento como completado?'
                                : '¿Estás seguro de cancelar esta sesión de entrenamiento?'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={handleStatusDialogClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant={pendingStatus === 'completed' ? 'default' : 'destructive'}
                            onClick={handleStatusChange}
                        >
                            {pendingStatus === 'completed' ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : pendingStatus === 'completed' ? (
                                'Marcar como completado'
                            ) : (
                                'Sí, cancelar sesión'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ChangeTrainingStatusModal;