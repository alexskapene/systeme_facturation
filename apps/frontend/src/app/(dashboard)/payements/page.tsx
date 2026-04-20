'use client';

import { useState, useEffect } from 'react';
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
  Search,
  ChevronLeft,
  ChevronRight,
  BadgePlus,
  Loader2,
  Calendar,
  CreditCard,
  User,
  FileText,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPayments, recordPayment } from '@/store/slices/paymentSlice';
import { fetchInvoices } from '@/store/slices/invoiceSlice';
import {
  PaymentMethod,
  getPaymentMethodLabel,
  CreatePaymentDTO,
  Payment,
} from '@/types/payment';
import { InvoiceStatus } from '@/types/factures';

export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const { payments, isLoading, error } = useAppSelector(
    (state) => state.payments,
  );
  const { invoices } = useAppSelector((state) => state.invoices);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<CreatePaymentDTO>({
    invoice: '',
    amount: 0,
    method: PaymentMethod.CASH,
    reference: '',
  });

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchInvoices());
  }, [dispatch]);

  const itemsPerPage = 10;

  // Filtrer les factures qui ont encore un solde à payer
  const unpaidInvoices = invoices.filter(
    (inv) =>
      inv.status !== InvoiceStatus.PAID &&
      inv.status !== InvoiceStatus.CANCELED,
  );

  const selectedInvoiceData = invoices.find(
    (inv) => inv._id === formData.invoice,
  );

  const filteredPayments = payments.filter((payment) => {
    const invoiceNum =
      typeof payment.invoice === 'string' ? '' : payment.invoice.invoiceNumber;
    const recordedBy =
      typeof payment.recordedBy === 'string'
        ? ''
        : `${payment.recordedBy.firstName} ${payment.recordedBy.name}`;

    return (
      invoiceNum.toLowerCase().includes(search.toLowerCase()) ||
      recordedBy.toLowerCase().includes(search.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePrint = (payment: Payment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceNum =
      typeof payment.invoice === 'string'
        ? payment.invoice
        : payment.invoice.invoiceNumber;
    const recorderName =
      typeof payment.recordedBy === 'string'
        ? 'Agent'
        : `${payment.recordedBy.firstName} ${payment.recordedBy.name}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de Paiement ${invoiceNum}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
            .company { font-size: 24px; font-weight: bold; color: #16a34a; }
            .receipt-title { font-size: 32px; color: #16a34a; text-align: right; font-weight: 800; }
            .receipt-info { color: #666; text-align: right; margin-top: 5px; font-weight: 600; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 12px; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; }
            .amount-box { background: #f0fdf4; padding: 30px; border-radius: 12px; border: 1px solid #bbf7d0; text-align: center; margin: 20px 0; }
            .amount-label { font-size: 14px; color: #166534; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
            .amount-value { font-size: 42px; font-weight: 900; color: #16a34a; }
            .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .details-table td:first-child { font-weight: 600; color: #64748b; width: 200px; }
            .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; }
            .signature-box { border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; font-size: 12px; color: #94a3b8; }
            .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">eTax Solution RDC</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Système de Facturation & Recettes</div>
            </div>
            <div>
              <div class="receipt-title">REÇU</div>
              <div class="receipt-info">Date: ${new Date(payment.date).toLocaleDateString('fr-FR')}</div>
              <div class="receipt-info">Facture: ${invoiceNum}</div>
            </div>
          </div>

          <div class="section">
            <div class="amount-box">
              <div class="amount-label">Montant Reçu</div>
              <div class="amount-value">$${payment.amount.toFixed(2)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Détails de la transaction</div>
            <table class="details-table">
              <tr>
                <td>Mode de paiement</td>
                <td>${getPaymentMethodLabel(payment.method)}</td>
              </tr>
              <tr>
                <td>Référence</td>
                <td>${payment.reference || 'Aucune'}</td>
              </tr>
              <tr>
                <td>Encaissé par</td>
                <td>${recorderName}</td>
              </tr>
              <tr>
                <td>Date d'enregistrement</td>
                <td>${new Date(payment.createdAt).toLocaleString('fr-FR')}</td>
              </tr>
            </table>
          </div>

          <div class="signature-grid">
            <div class="signature-box">Signature du Client</div>
            <div class="signature-box">Cachet & Signature Caissier</div>
          </div>

          <div class="footer">
            <p>Merci pour votre paiement !</p>
            <p style="margin-top: 5px;">Ce document sert de preuve officielle de paiement.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoice || formData.amount <= 0) return;

    const result = await dispatch(recordPayment(formData));
    if (recordPayment.fulfilled.match(result)) {
      setIsDialogOpen(false);
      setFormData({
        invoice: '',
        amount: 0,
        method: PaymentMethod.CASH,
        reference: '',
      });
      dispatch(fetchPayments());
      dispatch(fetchInvoices());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Paiements & Recettes
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg">
              <BadgePlus className="mr-2 h-4 w-4" />
              Enregistrer un paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau Paiement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <Field>
                <FieldLabel>Facture à payer</FieldLabel>
                <Select
                  value={formData.invoice}
                  onValueChange={(value) => {
                    const inv = invoices.find((i) => i._id === value);
                    setFormData({
                      ...formData,
                      invoice: value,
                      amount: inv ? inv.remainingAmount : 0,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une facture" />
                  </SelectTrigger>
                  <SelectContent>
                    {unpaidInvoices.map((inv) => (
                      <SelectItem key={inv._id} value={inv._id}>
                        {inv.invoiceNumber} - Reste: $
                        {inv.remainingAmount.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {selectedInvoiceData && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Facture:
                    </span>
                    <span className="font-bold">
                      ${selectedInvoiceData.totalTTC.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Déjà payé:</span>
                    <span className="text-green-600 font-bold">
                      ${selectedInvoiceData.amountPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-bold text-primary">
                      Reste à payer:
                    </span>
                    <span className="font-bold text-primary">
                      ${selectedInvoiceData.remainingAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Field>
                <FieldLabel>Montant du versement ($)</FieldLabel>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    className="pl-9"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    max={selectedInvoiceData?.remainingAmount}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Mode de paiement</FieldLabel>
                  <Select
                    value={formData.method}
                    onValueChange={(value: PaymentMethod) =>
                      setFormData({ ...formData, method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PaymentMethod).map((m) => (
                        <SelectItem key={m} value={m}>
                          {getPaymentMethodLabel(m)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Référence / N°</FieldLabel>
                  <Input
                    placeholder="Bordereau, etc."
                    value={formData.reference}
                    onChange={(e) =>
                      setFormData({ ...formData, reference: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg"
                disabled={
                  isLoading || !formData.invoice || formData.amount <= 0
                }
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="mr-2" />
                )}
                Confirmer le Paiement
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
                placeholder="Rechercher un paiement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
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
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead>Facture</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Encaissé par</TableHead>
                <TableHead className="text-right px-6">Montant</TableHead>
                <TableHead className="w-10 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-muted-foreground">
                        Chargement des transactions...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => {
                  const invoiceNum =
                    typeof payment.invoice === 'string'
                      ? payment.invoice
                      : payment.invoice.invoiceNumber;
                  const recorder =
                    typeof payment.recordedBy === 'string'
                      ? '...'
                      : `${payment.recordedBy.firstName} ${payment.recordedBy.name}`;

                  return (
                    <TableRow
                      key={payment._id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(payment.date).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-primary" />
                          <span className="font-bold text-primary">
                            {invoiceNum}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground italic text-sm">
                        {payment.reference || 'Aucune'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-semibold">
                            {getPaymentMethodLabel(payment.method)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{recorder}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-6 font-black text-green-600">
                        +${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-primary hover:bg-primary/10"
                          onClick={() => handlePrint(payment)}
                          title="Imprimer le reçu"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Aucun paiement trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Affichage de {paginatedPayments.length} sur{' '}
              {filteredPayments.length} transactions
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
    </div>
  );
}
