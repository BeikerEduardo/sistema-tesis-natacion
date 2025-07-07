import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardMetrics } from '../services';

// Clave para la consulta de métricas del dashboard
export const DASHBOARD_METRICS_KEY = 'dashboardMetrics';

/**
 * Hook personalizado para obtener las métricas básicas del dashboard
 * @returns Objeto con las métricas del dashboard y estado de la consulta
 */
export const useDashboardMetrics = () => {
  const {
    data: metrics,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<DashboardMetrics, Error>({
    queryKey: [DASHBOARD_METRICS_KEY],
    queryFn: () => dashboardService.getBasicMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    metrics,
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useDashboardMetrics;
