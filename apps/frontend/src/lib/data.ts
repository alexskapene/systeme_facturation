export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: 'payee' | 'en_attente' | 'en_retard';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  color: 'blue' | 'orange' | 'red';
}

export const clients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '653-676-803',
    createdAt: '11 jan 2022',
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    phone: '653-329-805',
    createdAt: '11 jan 2022',
  },
  {
    id: '3',
    name: 'Paul Lefevre',
    email: 'paul.lefevre@email.com',
    phone: '653-529-803',
    createdAt: '11 jan 2022',
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    phone: '653-412-756',
    createdAt: '15 fev 2022',
  },
  {
    id: '5',
    name: 'Lucas Moreau',
    email: 'lucas.moreau@email.com',
    phone: '653-987-124',
    createdAt: '20 mar 2022',
  },
];

export const invoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-001',
    clientId: '1',
    clientName: 'Jean Dupont',
    amount: 500.0,
    status: 'payee',
    date: '11 jan 2022',
  },
  {
    id: '2',
    number: 'INV-002',
    clientId: '2',
    clientName: 'Marie Martin',
    amount: 300.0,
    status: 'en_attente',
    date: '15 jan 2022',
  },
  {
    id: '3',
    number: 'INV-003',
    clientId: '3',
    clientName: 'Paul Lefevre',
    amount: 750.0,
    status: 'en_retard',
    date: '20 jan 2022',
  },
  {
    id: '4',
    number: 'INV-004',
    clientId: '4',
    clientName: 'Sophie Bernard',
    amount: 1200.0,
    status: 'payee',
    date: '25 jan 2022',
  },
  {
    id: '5',
    number: 'INV-005',
    clientId: '5',
    clientName: 'Lucas Moreau',
    amount: 450.0,
    status: 'en_attente',
    date: '01 fev 2022',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Produit A',
    price: 50.0,
    stock: 150,
    sales: 150,
    color: 'blue',
  },
  {
    id: '2',
    name: 'Produit B',
    price: 30.0,
    stock: 90,
    sales: 90,
    color: 'orange',
  },
  {
    id: '3',
    name: 'Produit C',
    price: 20.0,
    stock: 60,
    sales: 60,
    color: 'red',
  },
];

export const stats = {
  totalClients: 120,
  totalInvoices: 75,
  totalProducts: 45,
  totalRevenue: 12500,
};

export function getStatusLabel(status: Invoice['status']): string {
  switch (status) {
    case 'payee':
      return 'Payee';
    case 'en_attente':
      return 'En attente';
    case 'en_retard':
      return 'En retard';
  }
}

export function getStatusColor(status: Invoice['status']): string {
  switch (status) {
    case 'payee':
      return 'bg-green-500 text-white';
    case 'en_attente':
      return 'bg-yellow-500 text-white';
    case 'en_retard':
      return 'bg-red-500 text-white';
  }
}
