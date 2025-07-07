import { Gauge, HeartPulse, Weight, Wind } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

export type PhysicalDataCardProps = {
    physicalData: {
        weightBefore: number;
        weightAfter: number;
        breathingPattern: string;
        physicalStateRating: number;
        painReported: string;
    }
}

const TrainingDetailPhysicalDataCard = ({ physicalData }: PhysicalDataCardProps) => {
    return (
        <>
            {/* Datos físicos del atleta */}
            {physicalData && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Datos físicos del atleta</CardTitle>
                        <CardDescription>
                            Métricas de rendimiento y estado físico
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-start">
                                <Weight className="h-4 w-4 mt-1 mr-2 text-purple-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Peso antes (kg)</p>
                                    <p className="font-medium">{physicalData?.weightBefore || 0} kg</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <HeartPulse className="h-4 w-4 mt-1 mr-2 text-red-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Pérdida de peso</p>
                                    <p className="font-medium">{(physicalData.weightBefore - physicalData.weightAfter).toFixed(2)} kg</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Wind className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Patrón de respiración</p>
                                    <p className="font-medium">{physicalData.breathingPattern}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Gauge className="h-4 w-4 mt-1 mr-2 text-purple-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Valoración del estado físico</p>
                                    <p className="font-medium">{physicalData.physicalStateRating}/10</p>
                                </div>
                            </div>
                            {physicalData.painReported && (
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Dolor reportado</p>
                                    <p className="font-medium">{physicalData.painReported}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

        </>
    );
};

export default TrainingDetailPhysicalDataCard;