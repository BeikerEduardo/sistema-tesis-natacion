import { Package, Shirt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";


export type TrainingDetailUsedEquipmentCardProps = {
  equipment: {
    swimsuitType: string;
    equipmentUsed: string;
  }
}

const TrainingDetailUsedEquipmentCard = ({ equipment }: TrainingDetailUsedEquipmentCardProps) => {
  return (
    <>
      {/* Equipamiento utilizado */}
      {equipment && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Equipamiento</CardTitle>
            <CardDescription>
              Material utilizado durante el entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <Shirt className="h-4 w-4 mt-1 mr-2 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de traje de baño</p>
                  <p className="font-medium">{equipment.swimsuitType}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="h-4 w-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Equipamiento utilizado</p>
                  <p className="font-medium">{equipment.equipmentUsed}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default TrainingDetailUsedEquipmentCard;