import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import IncidentForm, { IncidentFormData } from "./IncidentForm";


interface TrainingDetailReportExternalFactorDialogProps {
    onSubmit: (data: IncidentFormData) => void;
    onCancel: () => void;
}

const TrainingDetailReportExternalFactorDialog = ({ onSubmit, onCancel }: TrainingDetailReportExternalFactorDialogProps) => {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="inline-block w-full">
                        <Button 
                            type="button"
                            variant="outline" 
                            className="flex items-center gap-2 w-full justify-start"
                        >
                            <AlertCircle className="h-4 w-4" />
                            Reportar Incidencia
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Reportar Incidencia o Factor Externo</DialogTitle>
                        <DialogDescription>
                            Registra cualquier factor externo que pueda afectar el rendimiento del atleta
                        </DialogDescription>
                    </DialogHeader>
                    <IncidentForm onSubmit={onSubmit} onCancel={onCancel} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default TrainingDetailReportExternalFactorDialog;