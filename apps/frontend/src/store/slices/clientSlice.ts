import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Client,
  ClientState,
  CreateClientDTO,
  UpdateClientDTO,
} from '@/types/clients';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

const initialState: ClientState = {
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all clients
export const fetchClients = createAsyncThunk(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Client[]>>('/clients');
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération des clients',
      );
    }
  },
);

// Fetch a single client
export const fetchClientById = createAsyncThunk(
  'clients/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération du client',
      );
    }
  },
);

// Create a new client
export const createClient = createAsyncThunk(
  'clients/create',
  async (clientData: CreateClientDTO, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Client>>(
        '/clients',
        clientData,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || 'Erreur lors de la création du client',
      );
    }
  },
);

// Update a client
export const updateClient = createAsyncThunk(
  'clients/update',
  async (
    { id, data }: { id: string; data: UpdateClientDTO },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put<ApiResponse<Client>>(
        `/clients/${id}`,
        data,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la modification du client',
      );
    }
  },
);

// Toggle client status
export const toggleClientStatus = createAsyncThunk(
  'clients/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch<ApiResponse<Client>>(
        `/clients/${id}/toggle-status`,
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

// Delete a client
export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/clients/${id}`);
      return id;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la suppression du client',
      );
    }
  },
);

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentClient: (state, action: PayloadAction<Client | null>) => {
      state.currentClient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchClients.fulfilled,
        (state, action: PayloadAction<Client[]>) => {
          state.isLoading = false;
          state.clients = action.payload;
        },
      )
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Client
      .addCase(
        fetchClientById.fulfilled,
        (state, action: PayloadAction<Client>) => {
          state.currentClient = action.payload;
        },
      )

      // Create Client
      .addCase(
        createClient.fulfilled,
        (state, action: PayloadAction<Client>) => {
          state.clients.unshift(action.payload);
        },
      )

      // Update Client
      .addCase(
        updateClient.fulfilled,
        (state, action: PayloadAction<Client>) => {
          const index = state.clients.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.clients[index] = action.payload;
          }
          if (state.currentClient?._id === action.payload._id) {
            state.currentClient = action.payload;
          }
        },
      )

      // Toggle Status
      .addCase(
        toggleClientStatus.fulfilled,
        (state, action: PayloadAction<Client>) => {
          const index = state.clients.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.clients[index] = action.payload;
          }
        },
      )

      // Delete Client
      .addCase(
        deleteClient.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.clients = state.clients.filter((c) => c._id !== action.payload);
        },
      );
  },
});

export const { clearError, setCurrentClient } = clientSlice.actions;
export default clientSlice.reducer;
