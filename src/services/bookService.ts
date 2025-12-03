import api from './api';
import type { Libro, LibroDTO, LibroBusquedaParams } from '../types';

export const bookService = {
  getAllBooks: async (params?: LibroBusquedaParams): Promise<Libro[]> => {
    const queryString = params?.q ? `?q=${encodeURIComponent(params.q)}` : '';
    const response = await api.get(`/libro/publico${queryString}`);
    return response.data;
  },

  getBookById: async (id: number): Promise<Libro> => {
    const response = await api.get(`/libro/${id}`);
    return response.data;
  },

  createBook: async (book: LibroDTO): Promise<{ message: string }> => {
    console.log('📤 bookService.createBook enviando:', {
      titulo: book.titulo,
      autor: book.autor,
      genero: book.genero,
      portada_length: book.portada?.length || 0,
      archivo_pdf_length: book.archivo_pdf?.length || 0
    });
    
    const response = await api.post('/libro/create', book);
    return response.data;
  },

  updateBook: async (id: number, book: LibroDTO): Promise<{ message: string }> => {
    const response = await api.put(`/libro/update/${id}`, book);
    return response.data;
  },

  deleteBook: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/libro/delete/${id}`);
    return response.data;
  },

  searchBooks: async (query: string): Promise<Libro[]> => {
    return bookService.getAllBooks({ q: query });
  },
};
