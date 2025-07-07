import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AthleteResumeTabContent = () => {
    return (
        <>
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Estadísticas recientes</CardTitle>
                        <CardDescription>
                            Resumen de los últimos entrenamientos y métricas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-sm font-medium text-muted-foreground">Último entrenamiento</h3>
                                <p className="text-2xl font-bold">3 días</p>
                                <p className="text-sm text-muted-foreground">Hace 3 días</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-sm font-medium text-muted-foreground">Sesiones este mes</h3>
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-sm text-muted-foreground">+2 vs mes pasado</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-sm font-medium text-muted-foreground">Mejor estilo</h3>
                                <p className="text-2xl font-bold">Libre</p>
                                <p className="text-sm text-muted-foreground">50m en 26.45s</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Próximas sesiones</CardTitle>
                        <CardDescription>
                            Próximas sesiones programadas para este atleta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                                    <div>
                                        <p className="font-medium">Entrenamiento de Resistencia</p>
                                        <p className="text-sm text-muted-foreground">Mañana, 16:00 - 18:00</p>
                                    </div>
                                    <Button variant="outline" size="sm">Ver detalles</Button>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full mt-2">
                                Ver todas las sesiones
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default AthleteResumeTabContent