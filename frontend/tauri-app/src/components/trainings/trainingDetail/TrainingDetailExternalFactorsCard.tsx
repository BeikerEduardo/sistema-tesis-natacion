import { ArrowLeft, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { format } from "date-fns";
import { ExternalFactor } from "@/types/externalFactor";
import { UseMutationResult } from "@tanstack/react-query";

export type TrainingDetailExternalFactorsCardProps = {
    externalFactors: ExternalFactor[];
    deleteIncidentMutation: UseMutationResult<any, Error, number>;
    openDeleteDialog: (incidentId: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    incidentsPerPage: number;
}

const translateIncidentType = (type: string) => {
    switch (type) {
        case "injury":
            return "Lesión";
        case "fatigue":
            return "Fatiga";
        case "nutrition":
            return 'Nutrición';
        case 'sleep':
            return 'Sueño'
        case 'stress':
            return 'Estrés'
        case 'medication':
            return 'Medicación'
        case 'other':
            return 'Otro';
        default:
            return type;
    }
};


const TrainingDetailExternalFactorsCard = ({ externalFactors, deleteIncidentMutation, openDeleteDialog, currentPage, setCurrentPage, incidentsPerPage }: TrainingDetailExternalFactorsCardProps) => {
    return (
        <>
            {/* Sección de Incidencias Reportadas */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle>Incidencias Reportadas</CardTitle>
                        <CardDescription>
                            Factores externos reportados para este entrenamiento
                        </CardDescription>
                    </div>
                    {externalFactors && externalFactors.length > 0 && (
                        <Badge className="ml-2">
                            {currentPage} de {Math.ceil(externalFactors.length / incidentsPerPage)}
                        </Badge>
                    )}
                </CardHeader>
                <CardContent>
                    {externalFactors && externalFactors.length > 0 ? (
                        <div className="space-y-4">
                            {externalFactors
                                .slice(
                                    (currentPage - 1) * incidentsPerPage,
                                    currentPage * incidentsPerPage
                                )
                                .map((incident: any) => (
                                    <div key={incident.id} className="border rounded-lg p-4 relative group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{translateIncidentType(incident.factorType)}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {incident.createdAt && format(new Date(incident.createdAt), 'dd/MM/yyyy HH:mm')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="capitalize">
                                                    Severidad: {incident.severity}/10
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteDialog(incident.id);
                                                    }}
                                                    disabled={deleteIncidentMutation.isPending}
                                                >
                                                    {deleteIncidentMutation.variables === incident.id && deleteIncidentMutation.isPending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">Eliminar incidencia</span>
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="mt-2">{incident.description}</p>
                                        
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <Badge variant="outline" className="bg-blue-50">
                                                Impacto: {incident.performanceImpact}/10
                                            </Badge>
                                            <Badge variant="outline" className="bg-amber-50">
                                                {incident.startDate && format(new Date(incident.startDate), 'dd/MM/yyyy')}
                                                {incident.endDate && incident.startDate !== incident.endDate && 
                                                    ` - ${format(new Date(incident.endDate), 'dd/MM/yyyy')}`}
                                            </Badge>
                                        </div>
                                        
                                        {incident.notes && (
                                            <div className="mt-2 p-3 bg-muted/50 rounded-md">
                                                <p className="text-sm font-medium">Notas adicionales:</p>
                                                <p className="text-sm">{incident.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            <p>No se han reportado incidencias para este entrenamiento.</p>
                        </div>
                    )}

                    <div className="flex justify-between gap-2 mt-4">
                        <Button
                            className='flex-1 justify-start'
                            disabled={currentPage === 1 || !externalFactors || externalFactors.length === 0}
                            variant="outline"
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                        </Button>
                        <Button
                            className='flex-1 justify-end'
                            disabled={!externalFactors || currentPage * incidentsPerPage >= externalFactors.length}
                            variant="outline"
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>

            </Card>
        </>
    )
}

export default TrainingDetailExternalFactorsCard;
