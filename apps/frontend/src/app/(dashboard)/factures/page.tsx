'use client';

import { useState, useEffect, type FormEvent } from 'react';
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
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Printer,
  Eye,
  BadgePlus,
  X,
  Loader2,
  FileText,
  Package,
} from 'lucide-react';
import {
  type Invoice,
  InvoiceStatus,
  getInvoiceStatusLabel,
  getInvoiceStatusColor,
  type CreateInvoiceDTO,
} from '@/types/factures';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchInvoices, createInvoice } from '@/store/slices/invoiceSlice';
import { fetchClients } from '@/store/slices/clientSlice';
import { fetchProducts } from '@/store/slices/productSlice';

type FilterStatus = 'all' | InvoiceStatus;

export default function FacturesPage() {
  const dispatch = useAppDispatch();
  const { invoices, isLoading, error } = useAppSelector(
    (state) => state.invoices,
  );
  const { clients } = useAppSelector((state) => state.clients);
  const { products } = useAppSelector((state) => state.products);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    items: [] as {
      product: string;
      quantity: number;
      name: string;
      priceHT: number;
      tvaRate: number;
    }[],
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: '1',
  });

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchClients());
    dispatch(fetchProducts());
  }, [dispatch]);

  const itemsPerPage = 10;

  // Filter products to show only active ones
  const activeProducts = products.filter((p) => p.active);

  const filteredInvoices = invoices.filter((invoice) => {
    const clientName =
      typeof invoice.client === 'string' ? '' : invoice.client.name;
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const addItemToForm = () => {
    if (!newItem.productId || !newItem.quantity) return;

    const product = products.find((p) => p._id === newItem.productId);
    if (!product) return;

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: product._id,
          name: product.name,
          quantity: parseInt(newItem.quantity),
          priceHT: product.priceHT,
          tvaRate: product.tvaRate,
        },
      ],
    }));
    setNewItem({ productId: '', quantity: '1' });
  };

  const removeItemFromForm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateFormTotals = () => {
    const totalHT = formData.items.reduce(
      (sum, item) => sum + item.priceHT * item.quantity,
      0,
    );
    const totalTVA = formData.items.reduce(
      (sum, item) => sum + item.priceHT * item.quantity * (item.tvaRate / 100),
      0,
    );
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.clientId || formData.items.length === 0) return;

    const invoiceData: CreateInvoiceDTO = {
      client: formData.clientId,
      items: formData.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
    };

    await dispatch(createInvoice(invoiceData));
    setIsDialogOpen(false);
    setFormData({
      clientId: '',
      items: [],
    });
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailDialogOpen(true);
  };

  const handlePrint = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPrintDialogOpen(true);
  };

  const executePrint = () => {
    if (!selectedInvoice) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const clientName =
      typeof selectedInvoice.client === 'string'
        ? 'Client'
        : selectedInvoice.client.name;

    const itemsRows = selectedInvoice.items
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">${item.unitPriceHT.toFixed(2)} $</td>
        <td class="text-right">${item.tvaAmount.toFixed(2)} $</td>
        <td class="text-right">${item.totalPriceTTC.toFixed(2)} $</td>
      </tr>
    `,
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture ${selectedInvoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
            .company { font-size: 24px; font-weight: bold; color: #1e40af; }
            .invoice-title { font-size: 32px; color: #1e40af; text-align: right; font-weight: 800; }
            .invoice-number { color: #666; text-align: right; margin-top: 5px; font-weight: 600; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 12px; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; }
            .client-info { background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .client-name { font-size: 18px; font-weight: 700; margin-bottom: 5px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f8fafc; color: #64748b; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
            td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .totals { margin-top: 30px; margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .total-row.final { font-weight: 800; font-size: 20px; border-top: 2px solid #1e40af; padding-top: 15px; margin-top: 10px; color: #1e40af; }
            .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">eTax Solution RDC</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Facturation Electronique Conforme</div>
            </div>
            <div>
              <div class="invoice-title">FACTURE</div>
              <div class="invoice-number">${selectedInvoice.invoiceNumber}</div>
              <div class="invoice-number">Date: ${new Date(selectedInvoice.createdAt).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Client</div>
            <div class="client-info">
              <div class="client-name">${clientName}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th class="text-center">Qté</th>
                <th class="text-right">Prix HT</th>
                <th class="text-right">TVA</th>
                <th class="text-right">Total TTC</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Total HT:</span>
              <span>${selectedInvoice.totalHT.toFixed(2)} $</span>
            </div>
            <div class="total-row">
              <span>Total TVA (16%):</span>
              <span>${selectedInvoice.totalTVA.toFixed(2)} $</span>
            </div>
            <div class="total-row final">
              <span>Total TTC:</span>
              <span>${selectedInvoice.totalTTC.toFixed(2)} $</span>
            </div>
          </div>

          <div class="footer">
            <p>Merci pour votre confiance !</p>
            <p style="margin-top: 5px;">Cette facture est générée électroniquement et est conforme à la réglementation en vigueur.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const filterButtons: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: InvoiceStatus.PAID, label: 'Payées' },
    { value: InvoiceStatus.PENDING, label: 'En attente' },
    { value: InvoiceStatus.CANCELED, label: 'Annulées' },
  ];

  const formTotals = calculateFormTotals();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Factures
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <BadgePlus /
              Nouvelle Facture
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Générer une nouvelle facture</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>Client</FieldLabel>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clientId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="border rounded-xl p-6 space-y-6 bg-muted/30">
                <h3 className="font-bold flex items-center gap-2 text-primary">
                  <Package className="h-4 w-4" />
                  Articles de la facture
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <Field className="md:col-span-2">
                    <FieldLabel>Produit (Actifs uniquement)</FieldLabel>
                    <Select
                      value={newItem.productId}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, productId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeProducts.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name} - ${product.priceHT.toFixed(2)} HT
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Quantité</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({ ...newItem, quantity: e.target.value })
                      }
                    />
                  </Field>
                  <Button
                    type="button"
                    onClick={addItemToForm}
                    variant="secondary"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>

                {formData.items.length > 0 && (
                  <div className="border rounded-lg bg-background overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead className="text-center">Qté</TableHead>
                          <TableHead className="text-right">Prix HT</TableHead>
                          <TableHead className="text-right">
                            Total TTC
                          </TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              ${item.priceHT.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              $
                              {(
                                item.priceHT *
                                item.quantity *
                                (1 + item.tvaRate / 100)
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItemFromForm(index)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {formData.items.length > 0 && (
                  <div className="flex flex-col items-end space-y-2 pt-4 border-t">
                    <div className="flex justify-between w-64 text-sm text-muted-foreground">
                      <span>Total Hors Taxe:</span>
                      <span>${formTotals.totalHT.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-64 text-sm text-muted-foreground">
                      <span>TVA (16%):</span>
                      <span>${formTotals.totalTVA.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-64 font-bold text-xl text-primary pt-2 border-t border-primary/20">
                      <span>Total TTC:</span>
                      <span>${formTotals.totalTTC.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg shadow-lg"
                disabled={
                  isLoading || formData.items.length === 0 || !formData.clientId
                }
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Printer className="mr-2" />
                )}
                Générer et Enregistrer la Facture
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="N° facture, client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.value}
                  variant={
                    statusFilter === filter.value ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                  className="rounded-full px-4"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-xl text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Total TTC</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-muted-foreground">
                        Chargement des factures...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => {
                  const clientName =
                    typeof invoice.client === 'string'
                      ? 'Chargement...'
                      : invoice.client.name;
                  return (
                    <TableRow
                      key={invoice._id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-bold text-primary">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{clientName}</TableCell>
                      <TableCell className="text-right font-bold">
                        ${invoice.totalTTC.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-bold',
                            getInvoiceStatusColor(invoice.status),
                          )}
                        >
                          {getInvoiceStatusLabel(invoice.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString(
                          'fr-FR',
                        )}
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewDetails(invoice)}
                            className="h-8 w-8 rounded-full"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePrint(invoice)}
                            className="h-8 w-8 rounded-full text-primary border-primary/20 hover:bg-primary/10"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Aucune facture trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Affichage de {paginatedInvoices.length} sur{' '}
              {filteredInvoices.length} factures
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                Page {currentPage} / {totalPages || 1}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Détails de la facture {selectedInvoice?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-8 border-b pb-6">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">
                    Client
                  </h4>
                  <p className="text-lg font-bold">
                    {typeof selectedInvoice.client === 'string'
                      ? ''
                      : selectedInvoice.client.name}
                  </p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">
                    Statut
                  </h4>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold',
                      getInvoiceStatusColor(selectedInvoice.status),
                    )}
                  >
                    {getInvoiceStatusLabel(selectedInvoice.status)}
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Désignation</TableHead>
                    <TableHead className="text-center">Quantité</TableHead>
                    <TableHead className="text-right">Prix HT</TableHead>
                    <TableHead className="text-right">TVA</TableHead>
                    <TableHead className="text-right">Total TTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.unitPriceHT.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.tvaAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${item.totalPriceTTC.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-col items-end space-y-2 pt-6 border-t">
                <div className="flex justify-between w-64 text-sm">
                  <span className="text-muted-foreground">
                    Total Hors Taxe:
                  </span>
                  <span>${selectedInvoice.totalHT.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 text-sm">
                  <span className="text-muted-foreground">TVA (16%):</span>
                  <span>${selectedInvoice.totalTVA.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 font-bold text-2xl text-primary pt-2">
                  <span>Total TTC:</span>
                  <span>${selectedInvoice.totalTTC.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handlePrint(selectedInvoice);
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" /> Imprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu avant impression</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Printer className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold">Prêt pour l'impression</h3>
            <p className="text-muted-foreground">
              La facture {selectedInvoice?.invoiceNumber} a été générée. Cliquez
              sur le bouton ci-dessous pour lancer l'impression.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsPrintDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  executePrint();
                  setIsPrintDialogOpen(false);
                }}
              >
                Confirmer l'impression
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
