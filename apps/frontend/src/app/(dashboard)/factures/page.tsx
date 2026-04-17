'use client';

import { useState, useRef } from 'react';
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
  Pencil,
  Trash2,
  Printer,
  Eye,
  X,
} from 'lucide-react';
import {
  invoices as initialInvoices,
  type Invoice,
  type InvoiceItem,
  InvoiceStatus,
  getInvoiceStatusLabel,
  getInvoiceStatusColor,
} from '@/types/factures';
import { clients } from '@/types/clients';
import { products } from '@/types/produit';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | InvoiceStatus;

export default function FacturesPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    status: InvoiceStatus.PENDING as InvoiceStatus,
    amountPaid: '0',
    items: [] as InvoiceItem[],
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: '1',
    tvaRate: '20',
  });

  const itemsPerPage = 10;
  const printRef = useRef<HTMLDivElement>(null);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const calculateItemTotals = (
    productId: string,
    quantity: number,
    tvaRate: number,
  ): InvoiceItem => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return {
        productId: '',
        name: '',
        quantity: 0,
        unitPriceHT: 0,
        tvaRate: 0,
        tvaAmount: 0,
        totalPriceTTC: 0,
      };
    }
    const unitPriceHT = product.priceHT;
    const totalHT = unitPriceHT * quantity;
    const tvaAmount = totalHT * (tvaRate / 100);
    const totalPriceTTC = totalHT + tvaAmount;

    return {
      productId,
      name: product.name,
      quantity,
      unitPriceHT,
      tvaRate,
      tvaAmount,
      totalPriceTTC,
    };
  };

  const calculateInvoiceTotals = (items: InvoiceItem[]) => {
    const totalHT = items.reduce(
      (sum, item) => sum + item.unitPriceHT * item.quantity,
      0,
    );
    const totalTVA = items.reduce((sum, item) => sum + item.tvaAmount, 0);
    const totalTTC = items.reduce((sum, item) => sum + item.totalPriceTTC, 0);
    return { totalHT, totalTVA, totalTTC };
  };

  const addItemToForm = () => {
    if (!newItem.productId || !newItem.quantity) return;

    const item = calculateItemTotals(
      newItem.productId,
      parseInt(newItem.quantity),
      parseFloat(newItem.tvaRate),
    );

    if (item.productId) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }));
      setNewItem({ productId: '', quantity: '1', tvaRate: '20' });
    }
  };

  const removeItemFromForm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        clientId: invoice.clientId,
        status: invoice.status,
        amountPaid: String(invoice.amountPaid),
        items: [...invoice.items],
      });
    } else {
      setEditingInvoice(null);
      setFormData({
        clientId: '',
        status: InvoiceStatus.PENDING,
        amountPaid: '0',
        items: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client || formData.items.length === 0) return;

    const totals = calculateInvoiceTotals(formData.items);
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    const remainingAmount = totals.totalTTC - amountPaid;

    if (editingInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingInvoice.id
            ? {
                ...inv,
                clientId: formData.clientId,
                clientName: client.name,
                items: formData.items,
                ...totals,
                status: formData.status,
                amountPaid,
                remainingAmount,
              }
            : inv,
        ),
      );
    } else {
      const year = new Date().getFullYear();
      const nextNumber = String(invoices.length + 1).padStart(4, '0');
      const newInvoice: Invoice = {
        id: String(Date.now()),
        invoiceNumber: `FAC-${year}-${nextNumber}`,
        clientId: formData.clientId,
        clientName: client.name,
        items: formData.items,
        ...totals,
        status: formData.status,
        amountPaid,
        remainingAmount,
        createdBy: '1',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setInvoices([...invoices, newInvoice]);
    }
    setIsDialogOpen(false);
    setFormData({
      clientId: '',
      status: InvoiceStatus.PENDING,
      amountPaid: '0',
      items: [],
    });
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
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

    const client = clients.find((c) => c.id === selectedInvoice.clientId);

    const itemsRows = selectedInvoice.items
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">${item.unitPriceHT.toFixed(2)} EUR</td>
        <td class="text-center">${item.tvaRate}%</td>
        <td class="text-right">${item.tvaAmount.toFixed(2)} EUR</td>
        <td class="text-right">${item.totalPriceTTC.toFixed(2)} EUR</td>
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
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company { font-size: 24px; font-weight: bold; color: #1e3a5f; }
            .invoice-title { font-size: 32px; color: #1e3a5f; text-align: right; }
            .invoice-number { color: #666; text-align: right; margin-top: 5px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
            .client-info { background: #f8f9fa; padding: 20px; border-radius: 8px; }
            .client-name { font-size: 18px; font-weight: 600; margin-bottom: 5px; }
            .client-detail { color: #666; margin-bottom: 3px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #1e3a5f; color: white; padding: 12px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .totals { margin-top: 20px; border-top: 2px solid #1e3a5f; padding-top: 15px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .total-row.final { font-weight: bold; font-size: 18px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 10px; }
            .payment-info { margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status-PAID { background: #d4edda; color: #155724; }
            .status-PENDING { background: #fff3cd; color: #856404; }
            .status-CANCELED { background: #f8d7da; color: #721c24; }
            .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">Systeme Facturation</div>
              <p style="color: #666; margin-top: 5px;">Votre partenaire de confiance</p>
            </div>
            <div>
              <div class="invoice-title">FACTURE</div>
              <div class="invoice-number">${selectedInvoice.invoiceNumber}</div>
              <div class="invoice-number">Date: ${new Date(selectedInvoice.createdAt).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Facture a</div>
            <div class="client-info">
              <div class="client-name">${selectedInvoice.clientName}</div>
              <div class="client-detail">Email: ${client?.email || 'N/A'}</div>
              <div class="client-detail">Tel: ${client?.phone || 'N/A'}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Details des articles</div>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th class="text-center">Quantite</th>
                  <th class="text-right">Prix HT</th>
                  <th class="text-center">TVA</th>
                  <th class="text-right">Montant TVA</th>
                  <th class="text-right">Total TTC</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
          </div>
          
          <div class="totals">
            <div class="total-row">
              <span>Total HT:</span>
              <span>${selectedInvoice.totalHT.toFixed(2)} EUR</span>
            </div>
            <div class="total-row">
              <span>Total TVA:</span>
              <span>${selectedInvoice.totalTVA.toFixed(2)} EUR</span>
            </div>
            <div class="total-row final">
              <span>Total TTC:</span>
              <span>${selectedInvoice.totalTTC.toFixed(2)} EUR</span>
            </div>
          </div>

          <div class="payment-info">
            <div class="total-row">
              <span>Montant paye:</span>
              <span>${selectedInvoice.amountPaid.toFixed(2)} EUR</span>
            </div>
            <div class="total-row" style="color: ${selectedInvoice.remainingAmount > 0 ? '#dc3545' : '#28a745'}">
              <span>Reste a payer:</span>
              <span>${selectedInvoice.remainingAmount.toFixed(2)} EUR</span>
            </div>
          </div>
          
          <div class="section" style="margin-top: 20px;">
            <div class="section-title">Statut</div>
            <span class="status status-${selectedInvoice.status}">${getInvoiceStatusLabel(selectedInvoice.status)}</span>
          </div>
          
          <div class="footer">
            <p>Merci pour votre confiance!</p>
            <p style="margin-top: 5px;">Systeme Facturation - Tous droits reserves</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filterButtons: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: InvoiceStatus.PAID, label: 'Payee' },
    { value: InvoiceStatus.PENDING, label: 'En attente' },
    { value: InvoiceStatus.CANCELED, label: 'Annulee' },
  ];

  const formTotals = calculateInvoiceTotals(formData.items);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Factures</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Facture
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-8xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? 'Modifier la facture' : 'Nouvelle facture'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="client">Client</FieldLabel>
                    <Select
                      value={formData.clientId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, clientId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionnez un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="status">Statut</FieldLabel>
                    <Select
                      value={formData.status}
                      onValueChange={(value: InvoiceStatus) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={InvoiceStatus.PENDING}>
                          En attente
                        </SelectItem>
                        <SelectItem value={InvoiceStatus.PAID}>
                          Payee
                        </SelectItem>
                        <SelectItem value={InvoiceStatus.CANCELED}>
                          Annulee
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {/* Add Items Section */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Ajouter des articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <Field>
                      <FieldLabel>Produit</FieldLabel>
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
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {product.priceHT.toFixed(2)} EUR
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Quantite</FieldLabel>
                      <Input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem({ ...newItem, quantity: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>TVA (%)</FieldLabel>
                      <Select
                        value={newItem.tvaRate}
                        onValueChange={(value) =>
                          setNewItem({ ...newItem, tvaRate: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5.5">5.5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Button type="button" onClick={addItemToForm}>
                      <Plus className="h-4 w-4 mr-1" /> Ajouter
                    </Button>
                  </div>

                  {/* Items List */}
                  {formData.items.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead className="text-center">Qte</TableHead>
                            <TableHead className="text-right">
                              Prix HT
                            </TableHead>
                            <TableHead className="text-center">TVA</TableHead>
                            <TableHead className="text-right">
                              Total TTC
                            </TableHead>
                            <TableHead className="w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-center">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.unitPriceHT.toFixed(2)} EUR
                              </TableCell>
                              <TableCell className="text-center">
                                {item.tvaRate}%
                              </TableCell>
                              <TableCell className="text-right">
                                {item.totalPriceTTC.toFixed(2)} EUR
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItemFromForm(index)}
                                >
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Totals */}
                  {formData.items.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total HT:</span>
                        <span>{formTotals.totalHT.toFixed(2)} EUR</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total TVA:</span>
                        <span>{formTotals.totalTVA.toFixed(2)} EUR</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total TTC:</span>
                        <span>{formTotals.totalTTC.toFixed(2)} EUR</span>
                      </div>
                    </div>
                  )}
                </div>

                <Field>
                  <FieldLabel htmlFor="amountPaid">
                    Montant paye (EUR)
                  </FieldLabel>
                  <Input
                    id="amountPaid"
                    type="number"
                    step="0.01"
                    min="0"
                    max={formTotals.totalTTC}
                    value={formData.amountPaid}
                    onChange={(e) =>
                      setFormData({ ...formData, amountPaid: e.target.value })
                    }
                    placeholder="0.00"
                  />
                  {formData.items.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Reste a payer:{' '}
                      {(
                        formTotals.totalTTC -
                        (parseFloat(formData.amountPaid) || 0)
                      ).toFixed(2)}{' '}
                      EUR
                    </p>
                  )}
                </Field>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={formData.items.length === 0 || !formData.clientId}
                >
                  {editingInvoice ? 'Modifier' : 'Creer la facture'}
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
                placeholder="Recherche des factures ..."
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
                <TableHead>Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Total HT</TableHead>
                <TableHead className="text-right">TVA</TableHead>
                <TableHead className="text-right">Total TTC</TableHead>
                <TableHead className="text-right">Paye</TableHead>
                <TableHead className="text-right">Reste</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalHT.toFixed(2)} EUR
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.totalTVA.toFixed(2)} EUR
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {invoice.totalTTC.toFixed(2)} EUR
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {invoice.amountPaid.toFixed(2)} EUR
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right',
                      invoice.remainingAmount > 0
                        ? 'text-red-600'
                        : 'text-green-600',
                    )}
                  >
                    {invoice.remainingAmount.toFixed(2)} EUR
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getInvoiceStatusColor(invoice.status),
                      )}
                    >
                      {getInvoiceStatusLabel(invoice.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(invoice)}
                        title="Voir details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePrint(invoice)}
                        title="Imprimer"
                      >
                        <Printer className="h-4 w-4" />
                        <span className="sr-only">Imprimer</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(invoice)}
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(invoice.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
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
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prec.
              </Button>
              <Select value={String(itemsPerPage)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 lignes par page</SelectItem>
                  <SelectItem value="20">20 lignes par page</SelectItem>
                  <SelectItem value="50">50 lignes par page</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
              >
                Suiv.
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Details de la facture {selectedInvoice?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Client
                  </p>
                  <p className="font-semibold">{selectedInvoice.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {
                      clients.find((c) => c.id === selectedInvoice.clientId)
                        ?.email
                    }
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Date
                  </p>
                  <p className="font-semibold">
                    {new Date(selectedInvoice.createdAt).toLocaleDateString(
                      'fr-FR',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                  </p>
                  <p className="text-sm">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        getInvoiceStatusColor(selectedInvoice.status),
                      )}
                    >
                      {getInvoiceStatusLabel(selectedInvoice.status)}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Articles</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-center">Qte</TableHead>
                      <TableHead className="text-right">Prix HT</TableHead>
                      <TableHead className="text-center">TVA</TableHead>
                      <TableHead className="text-right">Montant TVA</TableHead>
                      <TableHead className="text-right">Total TTC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.unitPriceHT.toFixed(2)} EUR
                        </TableCell>
                        <TableCell className="text-center">
                          {item.tvaRate}%
                        </TableCell>
                        <TableCell className="text-right">
                          {item.tvaAmount.toFixed(2)} EUR
                        </TableCell>
                        <TableCell className="text-right">
                          {item.totalPriceTTC.toFixed(2)} EUR
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Total HT:</span>
                  <span>{selectedInvoice.totalHT.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span>Total TVA:</span>
                  <span>{selectedInvoice.totalTVA.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total TTC:</span>
                  <span>{selectedInvoice.totalTTC.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between text-green-600 border-t pt-2">
                  <span>Montant paye:</span>
                  <span>{selectedInvoice.amountPaid.toFixed(2)} EUR</span>
                </div>
                <div
                  className={cn(
                    'flex justify-between font-semibold',
                    selectedInvoice.remainingAmount > 0
                      ? 'text-red-600'
                      : 'text-green-600',
                  )}
                >
                  <span>Reste a payer:</span>
                  <span>{selectedInvoice.remainingAmount.toFixed(2)} EUR</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
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
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Apercu de la facture</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div
              ref={printRef}
              className="space-y-6 p-4 border rounded-lg bg-white"
            >
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    Systeme Facturation
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Votre partenaire de confiance
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold">FACTURE</h3>
                  <p className="text-muted-foreground">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedInvoice.createdAt).toLocaleDateString(
                      'fr-FR',
                    )}
                  </p>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase mb-2">
                  Facture a
                </p>
                <p className="font-semibold">{selectedInvoice.clientName}</p>
                <p className="text-sm text-muted-foreground">
                  Email:{' '}
                  {clients.find((c) => c.id === selectedInvoice.clientId)
                    ?.email || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tel:{' '}
                  {clients.find((c) => c.id === selectedInvoice.clientId)
                    ?.phone || 'N/A'}
                </p>
              </div>

              {/* Invoice Items */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-center">Qte</TableHead>
                    <TableHead className="text-right">Prix HT</TableHead>
                    <TableHead className="text-center">TVA</TableHead>
                    <TableHead className="text-right">Total TTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.unitPriceHT.toFixed(2)} EUR
                      </TableCell>
                      <TableCell className="text-center">
                        {item.tvaRate}%
                      </TableCell>
                      <TableCell className="text-right">
                        {item.totalPriceTTC.toFixed(2)} EUR
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Total HT:</span>
                  <span>{selectedInvoice.totalHT.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span>Total TVA:</span>
                  <span>{selectedInvoice.totalTVA.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total TTC:</span>
                  <span>{selectedInvoice.totalTTC.toFixed(2)} EUR</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-green-600">
                  <span>Montant paye:</span>
                  <span>{selectedInvoice.amountPaid.toFixed(2)} EUR</span>
                </div>
                <div
                  className={cn(
                    'flex justify-between font-semibold',
                    selectedInvoice.remainingAmount > 0
                      ? 'text-red-600'
                      : 'text-green-600',
                  )}
                >
                  <span>Reste a payer:</span>
                  <span>{selectedInvoice.remainingAmount.toFixed(2)} EUR</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut:</span>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    getInvoiceStatusColor(selectedInvoice.status),
                  )}
                >
                  {getInvoiceStatusLabel(selectedInvoice.status)}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsPrintDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={executePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
