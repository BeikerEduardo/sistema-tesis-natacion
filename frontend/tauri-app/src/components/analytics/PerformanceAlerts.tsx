import { analyticsService, athletesService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { PerformanceAlert } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PageLoader } from "../ui/Loader";


const PerformanceAlerts = ({athleteId}: {athleteId: number})=>{
  const { data: alertsData, isLoading: isLoadingAlerts, error: alertsError } = useQuery<PerformanceAlert[]>({
    queryKey: ['athlete-alerts', athleteId],
    queryFn: async () => {
      console.log(`Fetching alerts for athlete ID: ${athleteId}`);
      const alerts = await analyticsService.getPerformanceAlerts(Number(athleteId!));
      console.log('Alerts fetched:', alerts);
      return alerts;
    },
    enabled: !!athleteId,
    // Refetch cada 5 minutos y cuando el componente vuelva a estar en foco
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  console.log(alertsData);
  return(
    <>

    <Card>
      <CardHeader>
        <CardTitle>Alertas de rendimiento</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingAlerts ? (
          <PageLoader text="Cargando alertas de rendimiento..." />
        ) : (
          <div className="space-y-4">
            {alertsData?.map((alert) => (
              <div key={alert.id}>
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        )}
        
      </CardContent>
    </Card>
    </>
  )
}

export default PerformanceAlerts;