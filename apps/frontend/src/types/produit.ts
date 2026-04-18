export interface Product {
  _id: string;
  name: string;
  description?: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  stockQuantity: number;
  minStockQuantity: number;
  supplier: string | { _id: string; name: string }; // ID or populated object
  createdBy: string | { _id: string; name: string };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  priceHT: number;
  tvaRate?: number;
  stockQuantity?: number;
  minStockQuantity?: number;
  supplier: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}
