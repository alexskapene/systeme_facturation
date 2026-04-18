export enum PaymentMethod {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
}

export interface Payment {
  _id: string;
  invoice: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  date: string;
  recordedBy: string;
}
