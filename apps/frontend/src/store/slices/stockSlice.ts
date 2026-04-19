import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { StockState, CreateStockMovementDTO } from '@/types/stock';
import { AxiosError } from 'axios';

const initialState: StockState = {
  movements: [],
  isLoading: false,
  error: null,
};

export const fetchStockHistory = createAsyncThunk(
  'stock/fetchHistory',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stock/product/${productId}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          "Erreur lors de la récupération de l'historique",
      );
    }
  },
);

export const createStockMovement = createAsyncThunk(
  'stock/createMovement',
  async (data: CreateStockMovementDTO, { rejectWithValue }) => {
    try {
      const response = await api.post('/stock', data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la création du mouvement',
      );
    }
  },
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    clearStockError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History
      .addCase(fetchStockHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movements = action.payload;
      })
      .addCase(fetchStockHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Movement
      .addCase(createStockMovement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStockMovement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movements.unshift(action.payload);
      })
      .addCase(createStockMovement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStockError } = stockSlice.actions;
export default stockSlice.reducer;
