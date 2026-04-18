import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Product,
  ProductState,
  CreateProductDTO,
  UpdateProductDTO,
} from '@/types/produit';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Product[]>>('/products');
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération des produits',
      );
    }
  },
);

// Fetch a single product
export const fetchProductById = createAsyncThunk(
  'products/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la récupération du produit',
      );
    }
  },
);

// Create a new product
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: CreateProductDTO, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Product>>(
        '/products',
        productData,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || 'Erreur lors de la création du produit',
      );
    }
  },
);

// Update a product
export const updateProduct = createAsyncThunk(
  'products/update',
  async (
    { id, data }: { id: string; data: UpdateProductDTO },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put<ApiResponse<Product>>(
        `/products/${id}`,
        data,
      );
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          'Erreur lors de la modification du produit',
      );
    }
  },
);

// Toggle product status
export const toggleProductStatus = createAsyncThunk(
  'products/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch<ApiResponse<Product>>(
        `/products/${id}/toggle-status`,
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

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.products = action.payload;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Product
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.currentProduct = action.payload;
        },
      )

      // Create Product
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.unshift(action.payload);
        },
      )

      // Update Product
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
          if (state.currentProduct?._id === action.payload._id) {
            state.currentProduct = action.payload;
          }
        },
      )

      // Toggle Status
      .addCase(
        toggleProductStatus.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        },
      );
  },
});

export const { clearError, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
