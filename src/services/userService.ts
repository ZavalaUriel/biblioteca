import api from './api';
import type { UsuarioDTO, UsuarioResponse } from '../types';

export const userService = {
  getAllUsers: async (): Promise<UsuarioResponse[]> => {
    const response = await api.get('/admin/usuario');
    return response.data;
  },

  getUserById: async (id: number): Promise<UsuarioResponse> => {
    const response = await api.get(`/admin/usuario/${id}`);
    return response.data;
  },

  createUser: async (user: UsuarioDTO): Promise<{ message: string }> => {
    const response = await api.post('/admin/usuario/create', user);
    return response.data;
  },

  updateUser: async (id: number, user: UsuarioDTO): Promise<{ message: string }> => {
    const response = await api.put(`/admin/usuario/update/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/usuario/delete/${id}`);
    return response.data;
  },
};
