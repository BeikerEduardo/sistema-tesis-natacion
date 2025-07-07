import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import authService from '@/services/auth/authService';
import { User } from '@/services';

/* ---------- Tipos ---------- */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  setToken: (token: string | null) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/* ---------- Context ---------- */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------- Provider ---------- */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const authCheckRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = Boolean(user && token);

  /* --- helpers --- */
  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    newToken ? authService.setToken(newToken) : authService.clearToken();
  }, []);

  /* --- efectos --- */
  useEffect(() => {
    if (authCheckRef.current) return;

    const verifyAuth = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        setIsInitialized(true);
        authCheckRef.current = true;

        if (!['/login', '/register'].includes(location.pathname)) {
          navigate('/login', { replace: true, state: { from: location } });
        }
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch {
        toast.error('Error de autenticación');
        setUser(null);
        setToken(null);
        if (!['/login', '/register'].includes(location.pathname)) {
          navigate('/login', { replace: true, state: { from: location } });
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        authCheckRef.current = true;
      }
    };

    verifyAuth();
  }, [token, navigate, location, setToken]);

  /* --- acciones --- */
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const result = await authService.login({ email, password });
        setToken(result.token);
        setUser(result.user);
        toast.success('¡Bienvenido!');
        return result.user;
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Error al iniciar sesión');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setToken],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        const result = await authService.register({ name, email, password });
        setToken(result.token);
        setUser(result.user);
        toast.success('¡Registro exitoso!');
        return result.user;
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Error al registrarse');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setToken],
  );

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Sesión cerrada exitosamente');
    navigate('/login', { replace: true });
  }, [navigate, setToken]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isInitialized,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ---------- Hook de consumo ---------- */
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
  return ctx;
};
