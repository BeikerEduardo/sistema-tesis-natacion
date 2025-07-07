import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const AthletePerformanceTabContent = () => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Rendimiento</CardTitle>
                    <CardDescription>
                        Métricas y estadísticas de rendimiento.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">Gráficos de rendimiento</p>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default AthletePerformanceTabContent