export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  nombreCompleto: string;
  rol: 'admin' | 'bibliotecario' | 'alumno';
}

export interface User {
  nombreCompleto: string;
  rol: 'admin' | 'bibliotecario' | 'alumno';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
