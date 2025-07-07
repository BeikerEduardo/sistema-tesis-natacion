import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";


const DeleteAthleteDialog = ({ athleteId, handleDeleteAthlete }: { athleteId: number, handleDeleteAthlete: (id: number) => void }) => {
    return (
        <Dialog > 
            <DialogTrigger asChild>
                <Button variant="outline" className="text-red-500"><Trash2 /></Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>¿Estás seguro de eliminar este atleta?</DialogTitle>
                    <DialogDescription className="mt-2 mb-4">
                        Esta acción no puede ser deshecha. Esta acción eliminará permanentemente el atleta
                        y eliminará sus datos de nuestros servidores.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                <Button variant={"destructive"} onClick={() => handleDeleteAthlete(athleteId)}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Eliminar
                </Button>
            </DialogFooter>
            </DialogContent>
            
        </Dialog>
    )
}
export default DeleteAthleteDialog;