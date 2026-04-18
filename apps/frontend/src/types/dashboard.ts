export interface DashboardStats {
  summary: {
    totalRevenue: number;
    totalInvoices: number;
    totalClients: number;
    lowStockCount: number;
  };
  lowStockProducts: Array<{
    _id: string;
    name: string;
    stockQuantity: number;
  }>;
  recentInvoices: Array<{
    _id: string;
    invoiceNumber: string;
    client: {
      _id: string;
      name: string;
      firstName: string;
    };
    totalTTC: number;
    status: string;
    createdAt: string;
  }>;
  salesOverTime: Array<{
    _id: string; // Date string
    amount: number;
  }>;
}

export interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}
