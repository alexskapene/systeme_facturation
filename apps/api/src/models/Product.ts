import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types/product.types';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    priceHT: {
      type: Number,
      required: true,
    },
    tvaRate: {
      type: Number,
      default: 16,
    }, // Norme RDC
    priceTTC: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    minStockQuantity: {
      type: Number,
      default: 0,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>('Product', ProductSchema);
