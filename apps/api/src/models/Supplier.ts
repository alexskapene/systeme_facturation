import mongoose, { Schema } from 'mongoose';
import { ISupplier } from '../types/supplier.types';

const SupplierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nif: {
      type: String,
      required: true,
      unique: true,
    },
    rccm: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
