import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosHeaders,
} from 'axios';
import { TOKEN_KEY } from './auth/authService';

const API_URL = 'http://localhost:5000/api/';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de solicitud unificado
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Usar AxiosHeaders para establecer el encabezado de autorización
      (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor de respuesta
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // No redirigimos aquí, dejamos que el AuthProvider maneje la redirección
    }
    return Promise.reject(error);
  }
);

export default apiClient;
