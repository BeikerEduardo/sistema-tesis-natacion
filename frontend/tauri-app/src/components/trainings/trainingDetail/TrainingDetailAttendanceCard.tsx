import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Athlete } from "@/types/athlete";
import { AlertCircle, Award, Badge, CheckCircle, UserCheck, UserX } from "lucide-react";

export type TrainingDetailAttendanceCardProps = {
    athlete: Athlete;
}

const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

const getBadgeColor = (category: string) => {
    switch (category) {
        case 'Senior':
            return 'bg-green-500/20 text-green-500';
        case 'Junior':
            return 'bg-blue-500/20 text-blue-500';

        default:
            return 'bg-muted/20 text-muted-foreground';
    }
}
const TrainingDetailAttendanceCard = ({ athlete }: TrainingDetailAttendanceCardProps) => {

    return (
        <>
            {/* Asistencia de Atleta */}
            <Card>
                <CardContent>
                <CardTitle>Asistencia</CardTitle>

                    <div className="mt-2">
                        <div key={athlete.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <div className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm mr-3 flex-shrink-0">
                                    {getInitials(athlete.firstName, athlete.lastName)}
                                </div>
                                <div>
                                    <span className="block font-medium">{athlete.firstName} {athlete.lastName}</span>
                                    {athlete.category && (
                                            
                                            <div className={`flex items-center ${getBadgeColor(athlete.category)} text-sm rounded-full px-2 py-1`}>
                                                <Award className="mr-1 h-4 w-4"/>
                                                <span>{athlete.category}</span>
                                            </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default TrainingDetailAttendanceCard;