import { Document, Types } from 'mongoose';

export enum ProductCategory {
  ARTICLE = 'ARTICLE',
  SERVICE = 'SERVICE',
}

export interface IProduct extends Document {
  category: ProductCategory;
  name: string;
  description?: string;
  priceHT: number;
  tvaRate: number; // Par défaut 16 en RDC
  priceTTC: number;
  stockQuantity: number;
  minStockQuantity?: number;
  supplier: Types.ObjectId;
  createdBy: Types.ObjectId;
  active: boolean;
}
