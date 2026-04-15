import mongoose, { Schema } from 'mongoose';
import { IPayment, PaymentMethod } from '../types/payment.types';

const PaymentSchema = new Schema<IPayment>(
  {
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    reference: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
