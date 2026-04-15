import { Document, Types } from 'mongoose';

export enum InvoiceStatus {
  PENDING = 'PENDING', // En attente de paiement
  PAID = 'PAID', // Payée
  CANCELED = 'CANCELED', // Annulée (Note de crédit)
}

export interface IInvoiceItem {
  product: Types.ObjectId;
  name: string; // On stocke le nom au moment de la vente (si le produit change plus tard)
  quantity: number;
  unitPriceHT: number;
  tvaAmount: number;
  totalPriceTTC: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string; // Ex: FAC-2024-0001
  client: Types.ObjectId;
  items: IInvoiceItem[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  status: InvoiceStatus;
  amountPaid: number;
  remainingAmount: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
}
