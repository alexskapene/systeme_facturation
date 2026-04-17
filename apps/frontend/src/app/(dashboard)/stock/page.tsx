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
  Printer,
  ArrowUp,
  ArrowDown,
  FileText,
} from 'lucide-react';
import {
  stockMovements as initialMovements,
  type StockMovement,
  StockMovementType,
  getStockMovementTypeLabel,
  getStockMovementTypeColor,
  isStockIn,
} from '@/types/stock';
import { products } from '@/types/produit';
import { cn } from '@/lib/utils';

type FilterType = 'all' | StockMovementType;

export default function StockPage() {
  const [movements, setMovements] = useState(initialMovements);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    type: StockMovementType.IN_SUPPLY as StockMovementType,
    quantity: '',
    reason: '',
    reference: '',
  });

  const itemsPerPage = 10;

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.productName.toLowerCase().includes(search.toLowerCase()) ||
      movement.reason.toLowerCase().includes(search.toLowerCase()) ||
      (movement.reference?.toLowerCase().includes(search.toLowerCase()) ??
        false);
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === formData.productId);
    if (!product || !formData.quantity || !formData.reason) return;

    const quantity = parseInt(formData.quantity);
    const isInMovement = isStockIn(formData.type);
    const previousStock = product.stockQuantity;
    const newStock = isInMovement
      ? previousStock + quantity
      : previousStock - quantity;

    const newMovement: StockMovement = {
      id: String(Date.now()),
      productId: formData.productId,
      productName: product.name,
      type: formData.type,
      quantity,
      reason: formData.reason,
      performedBy: '1',
      performedByName: 'John Doe',
      reference: formData.reference || undefined,
      previousStock,
      newStock,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMovements([newMovement, ...movements]);
    setIsDialogOpen(false);
    setFormData({
      productId: '',
      type: StockMovementType.IN_SUPPLY,
      quantity: '',
      reason: '',
      reference: '',
    });
  };

  const getReportMovements = () => {
    if (!reportStartDate || !reportEndDate) return movements;

    return movements.filter((m) => {
      const date = new Date(m.createdAt);
      const start = new Date(reportStartDate);
      const end = new Date(reportEndDate);
      return date >= start && date <= end;
    });
  };

  const printReport = () => {
    const reportMovements = getReportMovements();

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalIn = reportMovements
      .filter((m) => isStockIn(m.type))
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalOut = reportMovements
      .filter((m) => !isStockIn(m.type))
      .reduce((sum, m) => sum + m.quantity, 0);

    const movementsByType = Object.values(StockMovementType).map((type) => ({
      type,
      label: getStockMovementTypeLabel(type),
      count: reportMovements.filter((m) => m.type === type).length,
      quantity: reportMovements
        .filter((m) => m.type === type)
        .reduce((sum, m) => sum + m.quantity, 0),
    }));

    const rows = reportMovements
      .map(
        (m) => `
      <tr>
        <td>${new Date(m.createdAt).toLocaleDateString('fr-FR')}</td>
        <td>${m.productName}</td>
        <td>${getStockMovementTypeLabel(m.type)}</td>
        <td class="text-center ${isStockIn(m.type) ? 'text-green' : 'text-red'}">${isStockIn(m.type) ? '+' : '-'}${m.quantity}</td>
        <td>${m.reason}</td>
        <td>${m.reference || '-'}</td>
        <td>${m.previousStock} → ${m.newStock}</td>
        <td>${m.performedByName}</td>
      </tr>
    `,
      )
      .join('');

    const summaryRows = movementsByType
      .map(
        (t) => `
      <tr>
        <td>${t.label}</td>
        <td class="text-center">${t.count}</td>
        <td class="text-right">${t.quantity}</td>
      </tr>
    `,
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rapport Stock - ${reportStartDate} a ${reportEndDate}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; font-size: 12px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; }
            .company { font-size: 24px; font-weight: bold; color: #1e3a5f; }
            .report-title { font-size: 20px; color: #1e3a5f; text-align: right; }
            .report-period { color: #666; text-align: right; margin-top: 5px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 14px; font-weight: bold; color: #1e3a5f; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #1e3a5f; color: white; padding: 10px 8px; text-align: left; font-size: 11px; }
            td { padding: 8px; border-bottom: 1px solid #eee; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-green { color: #28a745; }
            .text-red { color: #dc3545; }
            .summary-box { display: flex; gap: 20px; margin-bottom: 25px; }
            .summary-card { flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
            .summary-card h4 { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
            .summary-card .value { font-size: 24px; font-weight: bold; }
            .summary-card .in { color: #28a745; }
            .summary-card .out { color: #dc3545; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 11px; border-top: 1px solid #ddd; padding-top: 15px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">Systeme Facturation</div>
              <p style="color: #666; margin-top: 5px;">Rapport des mouvements de stock</p>
            </div>
            <div>
              <div class="report-title">RAPPORT STOCK</div>
              <div class="report-period">Periode: ${new Date(reportStartDate).toLocaleDateString('fr-FR')} - ${new Date(reportEndDate).toLocaleDateString('fr-FR')}</div>
              <div class="report-period">Genere le: ${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-card">
              <h4>Total Mouvements</h4>
              <div class="value">${reportMovements.length}</div>
            </div>
            <div class="summary-card">
              <h4>Total Entrees</h4>
              <div class="value in">+${totalIn}</div>
            </div>
            <div class="summary-card">
              <h4>Total Sorties</h4>
              <div class="value out">-${totalOut}</div>
            </div>
            <div class="summary-card">
              <h4>Solde Net</h4>
              <div class="value ${totalIn - totalOut >= 0 ? 'in' : 'out'}">${totalIn - totalOut >= 0 ? '+' : ''}${totalIn - totalOut}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Resume par type de mouvement</div>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th class="text-center">Nombre</th>
                  <th class="text-right">Quantite totale</th>
                </tr>
              </thead>
              <tbody>
                ${summaryRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Detail des mouvements (${reportMovements.length})</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Produit</th>
                  <th>Type</th>
                  <th class="text-center">Quantite</th>
                  <th>Raison</th>
                  <th>Reference</th>
                  <th>Stock</th>
                  <th>Par</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>Systeme Facturation - Rapport genere automatiquement</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: StockMovementType.IN_SUPPLY, label: 'Appro.' },
    { value: StockMovementType.OUT_SALE, label: 'Vente' },
    { value: StockMovementType.OUT_LOSS, label: 'Perte' },
    { value: StockMovementType.OUT_EXPIRED, label: 'Peremption' },
    { value: StockMovementType.IN_RETURN, label: 'Retour' },
    { value: StockMovementType.ADJUSTMENT, label: 'Ajustement' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Mouvements de Stock
        </h1>
        <div className="flex gap-2">
          {/* Report Dialog */}
          <Dialog
            open={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Rapport
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generer un rapport de stock</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selectionnez une periode pour generer le rapport des
                  mouvements de stock.
                </p>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Date de debut</FieldLabel>
                    <Input
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Date de fin</FieldLabel>
                    <Input
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
                {reportStartDate && reportEndDate && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>{getReportMovements().length}</strong> mouvements
                      trouves pour cette periode
                    </p>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsReportDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={printReport}
                    disabled={!reportStartDate || !reportEndDate}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer le rapport
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Movement Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau mouvement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Enregistrer un mouvement de stock</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="product">Produit</FieldLabel>
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
                            {product.name} (Stock: {product.stockQuantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="type">Type de mouvement</FieldLabel>
                    <Select
                      value={formData.type}
                      onValueChange={(value: StockMovementType) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={StockMovementType.IN_SUPPLY}>
                          Approvisionnement (Entree)
                        </SelectItem>
                        <SelectItem value={StockMovementType.OUT_SALE}>
                          Vente (Sortie)
                        </SelectItem>
                        <SelectItem value={StockMovementType.OUT_LOSS}>
                          Perte (Casse/Vol)
                        </SelectItem>
                        <SelectItem value={StockMovementType.OUT_EXPIRED}>
                          Peremption
                        </SelectItem>
                        <SelectItem value={StockMovementType.IN_RETURN}>
                          Retour client
                        </SelectItem>
                        <SelectItem value={StockMovementType.ADJUSTMENT}>
                          Ajustement inventaire
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="quantity">Quantite</FieldLabel>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="Ex: 10"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reason">Raison</FieldLabel>
                    <Input
                      id="reason"
                      placeholder="Ex: Approvisionnement du fournisseur XYZ"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reference">
                      Reference (optionnel)
                    </FieldLabel>
                    <Input
                      id="reference"
                      placeholder="Ex: BL-2024-001 ou FAC-2024-001"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData({ ...formData, reference: e.target.value })
                      }
                    />
                  </Field>
                </FieldGroup>
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.value}
                  variant={typeFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTypeFilter(filter.value);
                    setCurrentPage(1);
                  }}
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
                <TableHead>Date</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Quantite</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Effectue par</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMovements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Aucun mouvement trouve
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {new Date(movement.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.productName}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                          getStockMovementTypeColor(movement.type),
                        )}
                      >
                        {getStockMovementTypeLabel(movement.type)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 font-medium',
                          isStockIn(movement.type)
                            ? 'text-green-600'
                            : 'text-red-600',
                        )}
                      >
                        {isStockIn(movement.type) ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={movement.reason}
                    >
                      {movement.reason}
                    </TableCell>
                    <TableCell>{movement.reference || '-'}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-muted-foreground">
                        {movement.previousStock}
                      </span>
                      <span className="mx-1">→</span>
                      <span className="font-medium">{movement.newStock}</span>
                    </TableCell>
                    <TableCell>{movement.performedByName}</TableCell>
                  </TableRow>
                ))
              )}
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
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prec.
              </Button>
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
    </div>
  );
}
