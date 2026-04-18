import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Supplier,
  SupplierState,
  CreateSupplierDTO,
  UpdateSupplierDTO,
} from '@/types/suppliers';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

const initialState: SupplierState = {
  suppliers: [],
  currentSupplier: null,
  isLoading: false,
  error: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all suppliers
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Supplier[]>>('/suppliers');
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération des fournisseurs',
      );
    }
  },
);

// Fetch a single supplier
export const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération du fournisseur',
      );
    }
  },
);

// Create a new supplier
export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (supplierData: CreateSupplierDTO, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Supplier>>(
        '/suppliers',
        supplierData,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la création du fournisseur',
      );
    }
  },
);

// Update a supplier
export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async (
    { id, data }: { id: string; data: UpdateSupplierDTO },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put<ApiResponse<Supplier>>(
        `/suppliers/${id}`,
        data,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la modification du fournisseur',
      );
    }
  },
);

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSupplier: (state, action: PayloadAction<Supplier | null>) => {
      state.currentSupplier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSuppliers.fulfilled,
        (state, action: PayloadAction<Supplier[]>) => {
          state.isLoading = false;
          state.suppliers = action.payload;
        },
      )
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Supplier
      .addCase(
        fetchSupplierById.fulfilled,
        (state, action: PayloadAction<Supplier>) => {
          state.currentSupplier = action.payload;
        },
      )

      // Create Supplier
      .addCase(
        createSupplier.fulfilled,
        (state, action: PayloadAction<Supplier>) => {
          state.suppliers.unshift(action.payload);
        },
      )

      // Update Supplier
      .addCase(
        updateSupplier.fulfilled,
        (state, action: PayloadAction<Supplier>) => {
          const index = state.suppliers.findIndex(
            (s) => s._id === action.payload._id,
          );
          if (index !== -1) {
            state.suppliers[index] = action.payload;
          }
          if (state.currentSupplier?._id === action.payload._id) {
            state.currentSupplier = action.payload;
          }
        },
      );
  },
});

export const { clearError, setCurrentSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
