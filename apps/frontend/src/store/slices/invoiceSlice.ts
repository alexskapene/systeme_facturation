import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Invoice, InvoiceState, CreateInvoiceDTO } from '@/types/factures';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all invoices
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Invoice[]>>('/invoices');
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération des factures',
      );
    }
  },
);

// Fetch a single invoice
export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération de la facture',
      );
    }
  },
);

// Create a new invoice
export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (invoiceData: CreateInvoiceDTO, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Invoice>>(
        '/invoices',
        invoiceData,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la création de la facture',
      );
    }
  },
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.currentInvoice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchInvoices.fulfilled,
        (state, action: PayloadAction<Invoice[]>) => {
          state.isLoading = false;
          state.invoices = action.payload;
        },
      )
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Invoice
      .addCase(
        fetchInvoiceById.fulfilled,
        (state, action: PayloadAction<Invoice>) => {
          state.currentInvoice = action.payload;
        },
      )

      // Create Invoice
      .addCase(
        createInvoice.fulfilled,
        (state, action: PayloadAction<Invoice>) => {
          state.invoices.unshift(action.payload);
        },
      );
  },
});

export const { clearError, setCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
