// App.tsx
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuthContext } from '@/context/AuthProvider'; // ← export nombrado
import MainNav from '@/components/layout/MainNav';
import Dashboard from '@/routes/dashboard/Dashboard';
import Login from '@/routes/auth/Login';
import Athletes from '@/routes/athletes/Athletes';
import AthleteDetail from '@/routes/athletes/AthleteDetail';
import NewAthlete from '@/routes/athletes/NewAthlete';
import EditAthlete from '@/routes/athletes/EditAthlete';
import Trainings from '@/routes/trainings/Trainings';
import TrainingDetail from '@/routes/trainings/TrainingDetail';
import NewTraining from '@/routes/trainings/NewTraining';
import EditTraining from '@/routes/trainings/EditTraining';
import Analytics from '@/routes/analytics/Analytics';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';

/* ---------- React‑Query ---------- */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      retry: 1,
    },
  },
});

/* ---------- Rutas protegidas ---------- */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuthContext();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

/* ---------- Rutas públicas (login/register) ---------- */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuthContext();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando…</div>;
  }

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

/* ---------- Layout autenticado ---------- */
const AuthenticatedLayout = () => (
  <div className="flex w-full h-screen bg-background">
    <MainNav />
    <main className="flex-1 overflow-y-auto">
      <div className="py-6 px-4 sm:px-6 lg:px-8 w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/athletes" element={<Athletes />} />
          <Route path="/athletes/new" element={<NewAthlete />} />
          <Route path="/athletes/:id" element={<AthleteDetail />} />
          <Route path="/athletes/:id/edit" element={<EditAthlete />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/trainings/new" element={<NewTraining />} />
          <Route path="/trainings/:id" element={<TrainingDetail />} />
          <Route path="/trainings/:id/edit" element={<EditTraining />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground">Página no encontrada</p>
              </div>
            }
          />
        </Routes>
      </div>
    </main>
  </div>
);

/* ---------- Layout público ---------- */
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    {children}
  </div>
);

/* ---------- App ---------- */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas - sin SidebarProvider */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <PublicLayout>
                    <Login />
                  </PublicLayout>
                </PublicRoute>
              }
            />

            {/* Rutas protegidas - con SidebarProvider */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AuthenticatedLayout />
                    {/* Toaster dentro del SidebarProvider para rutas protegidas */}
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
          
          {/* Toaster global - disponible en todas las rutas */}
          <Toaster />
        </AuthProvider>
      </HashRouter>

    </QueryClientProvider>
  );
}

export default App;
