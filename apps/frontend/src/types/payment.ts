export enum PaymentMethod {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
}

export interface Payment {
  _id: string;
  invoice: string | { _id: string; invoiceNumber: string };
  amount: number;
  method: PaymentMethod;
  reference?: string;
  date: string;
  recordedBy: string | { _id: string; name: string; firstName: string };
  createdAt: string;
}

export interface CreatePaymentDTO {
  invoice: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
}

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'Espèces';
    case PaymentMethod.MOBILE_MONEY:
      return 'Mobile Money';
    case PaymentMethod.BANK_TRANSFER:
      return 'Virement Bancaire';
    case PaymentMethod.CHEQUE:
      return 'Chèque';
    default:
      return method;
  }
};
