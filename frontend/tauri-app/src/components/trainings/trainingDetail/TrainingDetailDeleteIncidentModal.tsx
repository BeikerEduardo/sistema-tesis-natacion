import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

/**
 * Tipado de las props que espera el modal
 */
export type TrainingDetailDeleteIncidentModalProps = {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  handleDeleteCancel: () => void;
  handleDeleteConfirm: () => void;
  deleteIncidentMutation: { isPending: boolean }; // dale el tipo real de tu librería de queries
};

/**
 * Componente
 */
const TrainingDetailDeleteIncidentModal: React.FC<TrainingDetailDeleteIncidentModalProps> = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  handleDeleteCancel,
  handleDeleteConfirm,
  deleteIncidentMutation,
}) => {
  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </div>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta incidencia? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleDeleteCancel}
            disabled={deleteIncidentMutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={deleteIncidentMutation.isPending}
          >
            {deleteIncidentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingDetailDeleteIncidentModal;
