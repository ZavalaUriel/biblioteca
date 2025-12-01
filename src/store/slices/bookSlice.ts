import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BookState, Libro, LibroDTO } from '../../types';
import { bookService } from '../../services/bookService';

const initialState: BookState = {
  books: [],
  selectedBook: null,
  loading: false,
  error: null,
  searchResults: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchAll',
  async (searchQuery: string | undefined, { rejectWithValue }) => {
    try {
      console.log('🔍 fetchBooks llamado con searchQuery:', searchQuery);
      const books = await bookService.getAllBooks(searchQuery ? { q: searchQuery } : undefined);
      console.log('📚 Libros recibidos:', books.length, books);
      return books;
    } catch (error: any) {
      console.error('❌ Error al cargar libros:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al cargar libros');
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const book = await bookService.getBookById(id);
      return book;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar el libro');
    }
  }
);

export const createBook = createAsyncThunk(
  'books/create',
  async (book: LibroDTO, { rejectWithValue }) => {
    try {
      await bookService.createBook(book);
      return book;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear el libro');
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/update',
  async ({ id, book }: { id: number; book: LibroDTO }, { rejectWithValue }) => {
    try {
      await bookService.updateBook(id, book);
      return { id, book };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el libro');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/delete',
  async (id: number | string, { rejectWithValue }) => {
    try {
      await bookService.deleteBook(id as number);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar el libro');
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Libro[]>) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action: PayloadAction<Libro>) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create book
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<number | string>) => {
        state.loading = false;
        state.books = state.books.filter((book) => 
          (book.id !== action.payload) && (book._id !== action.payload)
        );
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBook, clearError } = bookSlice.actions;
export default bookSlice.reducer;
