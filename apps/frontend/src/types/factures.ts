export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export interface InvoiceItem {
  product: string | { _id: string; name: string };
  name: string;
  quantity: number;
  unitPriceHT: number;
  tvaAmount: number;
  totalPriceTTC: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  client: string | { _id: string; name: string };
  items: InvoiceItem[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  status: InvoiceStatus;
  amountPaid: number;
  remainingAmount: number;
  createdBy: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDTO {
  client: string;
  items: {
    product: string;
    quantity: number;
  }[];
}

export interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
}

export function getInvoiceStatusLabel(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.PAID:
      return 'Payée';
    case InvoiceStatus.PENDING:
      return 'En attente';
    case InvoiceStatus.CANCELED:
      return 'Annulée';
    default:
      return status;
  }
}

export function getInvoiceStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.PAID:
      return 'bg-green-100 text-green-700';
    case InvoiceStatus.PENDING:
      return 'bg-yellow-100 text-yellow-700';
    case InvoiceStatus.CANCELED:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
