export type RolUsuario = 'admin' | 'bibliotecario' | 'alumno';

export interface Usuario {
  id?: number;
  _id?: string;
  username?: string;
  nombre?: string;
  password: string;
  rol: RolUsuario;
  nombreCompleto: string;
}

export interface UsuarioDTO {
  username?: string;
  nombre?: string;
  password: string;
  rol: RolUsuario;
  nombreCompleto: string;
}

export interface UsuarioResponse {
  id?: number;
  _id?: string;
  username?: string;
  nombre?: string;
  rol: RolUsuario;
  nombreCompleto: string;
}

export interface UserState {
  users: UsuarioResponse[];
  loading: boolean;
  error: string | null;
}

export interface UsuarioValidaciones {
  nombre: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  password: {
    required: boolean;
    minLength: number;
    pattern: RegExp;
  };
  rol: {
    required: boolean;
    enum: RolUsuario[];
  };
  nombreCompleto: {
    required: boolean;
  };
}
