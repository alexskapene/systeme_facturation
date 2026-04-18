export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  rccm?: string;
  address: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDTO {
  name: string;
  email: string;
  phone: string;
  nif: string;
  rccm?: string;
  address: string;
}

export type UpdateSupplierDTO = Partial<CreateSupplierDTO>;

export interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  isLoading: boolean;
  error: string | null;
}
