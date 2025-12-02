export const GeneroLibro = {
  FICCION: 'Ficción',
  NO_FICCION: 'No Ficción',
  MISTERIO: 'Misterio',
  FANTASIA: 'Fantasía',
  CIENCIA_FICCION: 'Ciencia Ficción',
  ROMANCE: 'Romance',
  HISTORICO: 'Histórico',
  BIOGRAFIA: 'Biografía',
  AUTOAYUDA: 'Autoayuda',
  POESIA: 'Poesía'
} as const;

export type GeneroLibroType = typeof GeneroLibro[keyof typeof GeneroLibro];

export interface Libro {
  id?: number;
  _id?: string;
  titulo: string;
  autor?: string;
  genero: GeneroLibroType | string;
  portada: string;
  pdf?: string;
  universidad: string;
  fuente?: 'interno' | 'externo';
  esExterno?: boolean;
}

export interface LibroDTO {
  titulo: string;
  autor?: string;
  genero: GeneroLibroType | string;
  portada: string;
  archivo_pdf: string;
  universidad?: string;
}

export interface LibroViewModel {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  portada: string;
  pdf: string;
  universidad: string;
  fuente: 'interno' | 'externo';
}

export interface LibroBusquedaParams {
  q?: string;
}

export interface LibroBusquedaResponse {
  librosLocales: LibroViewModel[];
  librosExternos: LibroViewModel[];
}

export interface BookState {
  books: Libro[];
  selectedBook: Libro | null;
  loading: boolean;
  error: string | null;
  searchResults: LibroBusquedaResponse | null;
}

export interface LibroValidaciones {
  titulo: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  autor: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  genero: {
    required: boolean;
    enum: GeneroLibroType[];
  };
  portada: {
    required: boolean;
    format: string;
  };
  pdf: {
    required: boolean;
    format: string;
  };
}
