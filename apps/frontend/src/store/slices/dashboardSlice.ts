import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, DashboardStats } from '@/types/dashboard';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération des statistiques',
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.isLoading = false;
          state.stats = action.payload;
        },
      )
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
