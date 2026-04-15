import mongoose, { Schema } from 'mongoose';
import { IInvoice, InvoiceStatus } from '../types/invoice.types';

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
        },
        unitPriceHT: {
          type: Number,
          required: true,
        },
        tvaAmount: {
          type: Number,
          required: true,
        },
        totalPriceTTC: {
          type: Number,
          required: true,
        },
      },
    ],
    totalHT: {
      type: Number,
      required: true,
    },
    totalTVA: {
      type: Number,
      required: true,
    },
    totalTTC: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.PENDING,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
