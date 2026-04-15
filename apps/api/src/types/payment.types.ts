import { Document, Types } from 'mongoose';

export enum PaymentMethod {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY', // M-Pesa, Airtel Money, etc.
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
}

export interface IPayment extends Document {
  invoice: Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  reference?: string; // N° de transaction ou bordereau
  date: Date;
  recordedBy: Types.ObjectId;
}
