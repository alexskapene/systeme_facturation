import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { Payment, CreatePaymentDTO } from '@/types/payment';
import axios from 'axios';

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  isLoading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/payments');
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            'Erreur lors de la récupération des paiements',
        );
      }
      return rejectWithValue('Une erreur inattendue est survenue');
    }
  },
);

export const recordPayment = createAsyncThunk(
  'payments/record',
  async (paymentData: CreatePaymentDTO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payments', paymentData);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Erreur lors de l'enregistrement du paiement",
        );
      }
      return rejectWithValue('Une erreur inattendue est survenue');
    }
  },
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(recordPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(recordPayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
