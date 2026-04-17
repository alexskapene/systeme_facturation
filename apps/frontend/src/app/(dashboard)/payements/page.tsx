'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { products } from '@/lib/data';
import { cn } from '@/lib/utils';

interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'entree' | 'sortie' | 'ajustement';
  quantity: number;
  reason: string;
  date: string;
  user: string;
}

const initialTransactions: StockTransaction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Produit A',
    type: 'entree',
    quantity: 50,
    reason: 'Approvisionnement',
    date: '10 jan 2022',
    user: 'Admin',
  },
  {
    id: '2',
    productId: '2',
    productName: 'Produit B',
    type: 'sortie',
    quantity: 10,
    reason: 'Vente',
    date: '11 jan 2022',
    user: 'Admin',
  },
  {
    id: '3',
    productId: '1',
    productName: 'Produit A',
    type: 'sortie',
    quantity: 5,
    reason: 'Vente',
    date: '12 jan 2022',
    user: 'Admin',
  },
  {
    id: '4',
    productId: '3',
    productName: 'Produit C',
    type: 'ajustement',
    quantity: -2,
    reason: 'Inventaire',
    date: '13 jan 2022',
    user: 'Admin',
  },
  {
    id: '5',
    productId: '2',
    productName: 'Produit B',
    type: 'entree',
    quantity: 30,
    reason: 'Approvisionnement',
    date: '14 jan 2022',
    user: 'Admin',
  },
];

const getTypeLabel = (type: StockTransaction['type']) => {
  const labels = {
    entree: 'Entree',
    sortie: 'Sortie',
    ajustement: 'Ajustement',
  };
  return labels[type];
};

const getTypeColor = (type: StockTransaction['type']) => {
  const colors = {
    entree: 'bg-green-100 text-green-800',
    sortie: 'bg-red-100 text-red-800',
    ajustement: 'bg-blue-100 text-blue-800',
  };
  return colors[type];
};

const getTypeIcon = (type: StockTransaction['type']) => {
  if (type === 'entree')
    return <ArrowDown className="h-4 w-4 text-green-600" />;
  if (type === 'sortie') return <ArrowUp className="h-4 w-4 text-red-600" />;
  return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | StockTransaction['type']
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'entree' as StockTransaction['type'],
    quantity: '',
    reason: '',
  });
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.productName.toLowerCase().includes(search.toLowerCase()) ||
      t.reason.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === formData.productId);
    if (!product) return;

    const newTransaction: StockTransaction = {
      id: String(Date.now()),
      productId: formData.productId,
      productName: product.name,
      type: formData.type,
      quantity: parseInt(formData.quantity),
      reason: formData.reason,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      user: 'Admin',
    };
    setTransactions([newTransaction, ...transactions]);
    setIsDialogOpen(false);
    setFormData({ productId: '', type: 'entree', quantity: '', reason: '' });
  };

  const filterButtons: {
    value: 'all' | StockTransaction['type'];
    label: string;
  }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'entree', label: 'Entrees' },
    { value: 'sortie', label: 'Sorties' },
    { value: 'ajustement', label: 'Ajustements' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            TransactionStock
          </h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-secondary font-bold hover:scale-[1.02] transition-transform">
              <Plus className="mr-2 h-4 w-4 text-secondary  " />
              Nouvelle Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle transaction de stock</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Produit</FieldLabel>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, productId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionnez un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(value: StockTransaction['type']) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entree">Entree</SelectItem>
                      <SelectItem value="sortie">Sortie</SelectItem>
                      <SelectItem value="ajustement">Ajustement</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Quantite</FieldLabel>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Raison</FieldLabel>
                  <Input
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    placeholder="Ex: Vente, Approvisionnement, Inventaire..."
                    required
                  />
                </Field>
                <Button type="submit" className="w-full">
                  Enregistrer
                </Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Recherche ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center  gap-2">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.value}
                  variant={typeFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(filter.value)}
                  className={
                    typeFilter === filter.value
                      ? 'text-secondary'
                      : 'text-primary'
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Quantite</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Utilisateur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                          getTypeColor(transaction.type),
                        )}
                      >
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.productName}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'font-medium',
                      transaction.type === 'entree' && 'text-green-600',
                      transaction.type === 'sortie' && 'text-red-600',
                    )}
                  >
                    {transaction.type === 'entree'
                      ? '+'
                      : transaction.type === 'sortie'
                        ? '-'
                        : ''}
                    {Math.abs(transaction.quantity)}
                  </TableCell>
                  <TableCell>{transaction.reason}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages || 1}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Prec.
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
              >
                Suiv. <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
