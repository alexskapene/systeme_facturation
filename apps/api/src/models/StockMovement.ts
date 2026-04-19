import mongoose, { Schema } from 'mongoose';
import { IStockMovement, StockMovementType } from '../types/stock.types';

const StockMovementSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(StockMovementType),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    reference: {
      type: String,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IStockMovement>(
  'StockMovement',
  StockMovementSchema,
);
