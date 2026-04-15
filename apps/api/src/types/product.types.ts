import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  priceHT: number;
  tvaRate: number; // Par défaut 16 en RDC
  priceTTC: number;
  stockQuantity: number;
  supplier: Types.ObjectId;
  createdBy: Types.ObjectId;
  active: boolean;
}
