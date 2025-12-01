import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserState, UsuarioDTO, UsuarioResponse } from '../../types';
import { userService } from '../../services/userService';

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const users = await userService.getAllUsers();
      return users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar usuarios');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (user: UsuarioDTO, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(user);
      console.log('Response create user:', response);
      return user;
    } catch (error: any) {
      console.error('Error en createUser thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al crear usuario');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, user }: { id: number | string; user: UsuarioDTO }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id as number, user);
      console.log('Response update user:', response);
      return { id, user };
    } catch (error: any) {
      console.error('Error en updateUser thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser(id as number);
      console.log('Response delete user:', response);
      return id;
    } catch (error: any) {
      console.error('Error en deleteUser thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar usuario');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsuarioResponse[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number | string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => 
          (user.id !== action.payload) && (user._id !== action.payload)
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
