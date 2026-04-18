export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  status: InvoiceStatus;
  amountPaid: number;
  remainingAmount: number;
  createdBy: string;
  createdAt: string;
}
export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}
export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  unitPriceHT: number;
  tvaRate: number;
  tvaAmount: number;
  totalPriceTTC: number;
}

export const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'FAC-2024-0001',
    clientId: '1',
    clientName: 'Jean Dupont',
    items: [
      {
        productId: '1',
        name: 'Produit A',
        quantity: 5,
        unitPriceHT: 50.0,
        tvaRate: 20,
        tvaAmount: 50.0,
        totalPriceTTC: 300.0,
      },
      {
        productId: '2',
        name: 'Produit B',
        quantity: 3,
        unitPriceHT: 30.0,
        tvaRate: 20,
        tvaAmount: 18.0,
        totalPriceTTC: 108.0,
      },
    ],
    totalHT: 340.0,
    totalTVA: 68.0,
    totalTTC: 408.0,
    status: InvoiceStatus.PAID,
    amountPaid: 408.0,
    remainingAmount: 0,
    createdBy: '1',
    createdAt: '2024-01-11',
  },
  {
    id: '2',
    invoiceNumber: 'FAC-2024-0002',
    clientId: '2',
    clientName: 'Marie Martin',
    items: [
      {
        productId: '3',
        name: 'Produit C',
        quantity: 10,
        unitPriceHT: 20.0,
        tvaRate: 20,
        tvaAmount: 40.0,
        totalPriceTTC: 240.0,
      },
    ],
    totalHT: 200.0,
    totalTVA: 40.0,
    totalTTC: 240.0,
    status: InvoiceStatus.PENDING,
    amountPaid: 100.0,
    remainingAmount: 140.0,
    createdBy: '2',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    invoiceNumber: 'FAC-2024-0003',
    clientId: '3',
    clientName: 'Paul Lefevre',
    items: [
      {
        productId: '1',
        name: 'Produit A',
        quantity: 10,
        unitPriceHT: 50.0,
        tvaRate: 20,
        tvaAmount: 100.0,
        totalPriceTTC: 600.0,
      },
      {
        productId: '2',
        name: 'Produit B',
        quantity: 5,
        unitPriceHT: 30.0,
        tvaRate: 20,
        tvaAmount: 30.0,
        totalPriceTTC: 180.0,
      },
    ],
    totalHT: 650.0,
    totalTVA: 130.0,
    totalTTC: 780.0,
    status: InvoiceStatus.PENDING,
    amountPaid: 0,
    remainingAmount: 780.0,
    createdBy: '1',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    invoiceNumber: 'FAC-2024-0004',
    clientId: '4',
    clientName: 'Sophie Bernard',
    items: [
      {
        productId: '1',
        name: 'Produit A',
        quantity: 20,
        unitPriceHT: 50.0,
        tvaRate: 20,
        tvaAmount: 200.0,
        totalPriceTTC: 1200.0,
      },
    ],
    totalHT: 1000.0,
    totalTVA: 200.0,
    totalTTC: 1200.0,
    status: InvoiceStatus.PAID,
    amountPaid: 1200.0,
    remainingAmount: 0,
    createdBy: '3',
    createdAt: '2024-01-25',
  },
  {
    id: '5',
    invoiceNumber: 'FAC-2024-0005',
    clientId: '5',
    clientName: 'Lucas Moreau',
    items: [
      {
        productId: '2',
        name: 'Produit B',
        quantity: 8,
        unitPriceHT: 30.0,
        tvaRate: 20,
        tvaAmount: 48.0,
        totalPriceTTC: 288.0,
      },
      {
        productId: '3',
        name: 'Produit C',
        quantity: 6,
        unitPriceHT: 20.0,
        tvaRate: 20,
        tvaAmount: 24.0,
        totalPriceTTC: 144.0,
      },
    ],
    totalHT: 360.0,
    totalTVA: 72.0,
    totalTTC: 432.0,
    status: InvoiceStatus.CANCELED,
    amountPaid: 0,
    remainingAmount: 432.0,
    createdBy: '2',
    createdAt: '2024-02-01',
  },
];
export function getInvoiceStatusLabel(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.PAID:
      return 'Payee';
    case InvoiceStatus.PENDING:
      return 'En attente';
    case InvoiceStatus.CANCELED:
      return 'Annulee';
  }
}

export function getInvoiceStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.PAID:
      return 'bg-green-500 text-white';
    case InvoiceStatus.PENDING:
      return 'bg-yellow-500 text-white';
    case InvoiceStatus.CANCELED:
      return 'bg-red-500 text-white';
  }
}
