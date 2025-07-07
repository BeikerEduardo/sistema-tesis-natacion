import { User } from "./user";

/**
 * Interfaz para los datos de autenticación
 */
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

/**
 * Interfaz para los datos de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interfaz para los datos de registro
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}