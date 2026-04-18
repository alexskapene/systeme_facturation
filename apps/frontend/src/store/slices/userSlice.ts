import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState, CreateUserDTO, UpdateUserDTO } from '@/types/user';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<User[]>>('/users');
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération des utilisateurs',
      );
    }
  },
);

// Create a new user
export const createUser = createAsyncThunk(
  'users/create',
  async (userData: CreateUserDTO, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<User>>('/users', userData);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          "Erreur lors de la création de l'utilisateur",
      );
    }
  },
);

// Update a user
export const updateUser = createAsyncThunk(
  'users/update',
  async (
    { id, data }: { id: string; data: UpdateUserDTO },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour de l'utilisateur",
      );
    }
  },
);

// Toggle user status
export const toggleUserStatus = createAsyncThunk(
  'users/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch<ApiResponse<User>>(
        `/users/${id}/toggle-status`,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || 'Erreur lors du changement de statut',
      );
    }
  },
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create User
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.unshift(action.payload);
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Toggle Status
      .addCase(
        toggleUserStatus.fulfilled,
        (state, action: PayloadAction<User>) => {
          const index = state.users.findIndex(
            (u) => u._id === action.payload._id,
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        },
      );
  },
});

export const { clearError, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
