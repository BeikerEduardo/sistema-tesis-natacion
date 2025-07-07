import { LoginCredentials, RegisterData } from '@/types/auth';
import apiClient from '../api';
import { User } from '@/types/user';

// Constantes para las claves de almacenamiento (exportadas para usar en api.ts)
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

/**
 * Servicio para la autenticación de usuarios
 */
class AuthService {
  /**
   * Inicia sesión con las credenciales proporcionadas
   */
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Manejar la estructura anidada de la respuesta
    const responseData = response.data;
    
    // Verificar si la respuesta tiene la estructura esperada
    if (!responseData.success) {
      throw new Error('Login failed: Server reported failure');
    }
    
    // La respuesta real está anidada en data
    const authData = responseData.data;
    
    if (!authData || !authData.token) {
      console.error('Invalid response structure:', responseData);
      throw new Error('Login failed: Invalid response structure');
    }
    
    // Guardar token y usuario
    this.setToken(authData.token);
    this.setUser(authData.user);
    
    // Asegurar que el usuario tenga el token
    const userWithToken = {
      ...authData.user,
      token: authData.token
    };
    
    return { token: authData.token, user: userWithToken };
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterData): Promise<{ token: string; user: User }> {
    const response = await apiClient.post('/auth/register', userData);
    
    // Manejar la estructura anidada de la respuesta
    const responseData = response.data;
    
    // Verificar si la respuesta tiene la estructura esperada
    if (!responseData.success) {
      throw new Error('Registration failed: Server reported failure');
    }
    
    // La respuesta real está anidada en data
    const authData = responseData.data;
    
    if (!authData || !authData.token) {
      console.error('Invalid response structure:', responseData);
      throw new Error('Registration failed: Invalid response structure');
    }
    
    // Guardar token y usuario
    this.setToken(authData.token);
    this.setUser(authData.user);
    
    // Asegurar que el usuario tenga el token
    const userWithToken = {
      ...authData.user,
      token: authData.token
    };
    
    return { token: authData.token, user: userWithToken };
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Establece el token de autenticación
   */
  setToken(token: string): void {
    if (!token) {
      console.warn('Attempting to set empty token');
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Elimina el token de autenticación
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Obtiene los datos del usuario actual
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      const user = JSON.parse(userJson);
      // Asegurarse de que el token esté incluido en el objeto usuario
      const token = this.getToken();
      if (token) {
        user.token = token;
      }
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Establece los datos del usuario
   */
  setUser(user: User): void {
    if (!user) {
      console.warn('Attempting to set empty user');
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export default new AuthService();
