import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@/types/auth';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action asynchrone pour le Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<LoginResponse>(
        '/auth/login',
        credentials,
      );

      // Stockage sécurisé côté client
      const { user, token } = response.data.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      // Cookie pour le middleware Next.js
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;

      return { user, token };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || 'Erreur de connexion',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Pour recharger l'utilisateur au démarrage
    hydrateAuth: (state) => {
      const userStr = localStorage.getItem('user_data');
      if (userStr) {
        try {
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        } catch {
          state.user = null;
          state.isAuthenticated = false;
        }
      }
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.error = null;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { hydrateAuth, logout } = authSlice.actions;
export default authSlice.reducer;
