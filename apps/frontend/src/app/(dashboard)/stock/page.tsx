'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { cn } from '@/lib/utils';
import { fetchProducts } from '@/store/slices/productSlice';
import { createStockMovement } from '@/store/slices/stockSlice';
import { fetchSuppliers } from '@/store/slices/supplierSlice';
import { Product } from '@/types/produit';
import { StockMovementType } from '@/types/stock';
import { AlertTriangle, Package, PlusCircle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StockPage() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { suppliers } = useAppSelector((state) => state.suppliers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMovementOpen, setIsMovementOpen] = useState(false);

  // Form state
  const [movementForm, setMovementForm] = useState({
    type: StockMovementType.IN_SUPPLY,
    quantity: 1,
    reason: '',
    supplier: '',
    reference: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalQuantity = products.reduce(
    (acc, p) => acc + (p.stockQuantity || 0),
    0,
  );

  const handleOpenMovement = (product: Product) => {
    setSelectedProduct(product);
    setMovementForm({
      type: StockMovementType.IN_SUPPLY,
      quantity: 1,
      reason: '',
      supplier: '',
      reference: '',
    });
    setIsMovementOpen(true);
  };

  const handleSubmitMovement = async () => {
    if (!selectedProduct) return;

    await dispatch(
      createStockMovement({
        product: selectedProduct._id,
        ...movementForm,
      }),
    ).unwrap();

    setIsMovementOpen(false);
    dispatch(fetchProducts()); // Refresh stock levels
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Gestion des Stocks
          </h1>
          <p className="text-slate-500 font-medium">
            Suivez et ajustez les niveaux de stock de vos produits
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-3xl bg-blue-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Total Produits
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {products.length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-amber-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Stock Faible
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {products.filter((p: Product) => p.stockQuantity < 10).length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-green-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest">
                Valeur Stock
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {totalQuantity.toLocaleString()} Unités
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-black text-slate-800">
                Niveaux de Stock Actuels
              </CardTitle>
              <CardDescription>
                Liste de tous les produits et leur disponibilité
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10 rounded-xl border-slate-200 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold py-4">Produit</TableHead>
                <TableHead className="font-bold text-center">
                  Stock Actuel
                </TableHead>
                <TableHead className="font-bold">Statut</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={product._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Package size={20} />
                      </div>
                      <span className="font-bold text-slate-700">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        'text-lg font-black',
                        product.stockQuantity < 10
                          ? 'text-red-500'
                          : 'text-slate-800',
                      )}
                    >
                      {product.stockQuantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.stockQuantity <= 0 ? (
                      <Badge className="bg-red-100 text-red-600 border-red-200 hover:bg-red-100">
                        Rupture
                      </Badge>
                    ) : product.stockQuantity < 10 ? (
                      <Badge className="bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-100">
                        Faible
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-600 border-green-200 hover:bg-green-100">
                        En stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="rounded-xl gap-2 font-bold shadow-sm"
                        onClick={() => handleOpenMovement(product)}
                      >
                        <PlusCircle size={16} />
                        Mouvement
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL NOUVEAU MOUVEMENT */}
      <Dialog open={isMovementOpen} onOpenChange={setIsMovementOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800">
              Nouveau Mouvement
            </DialogTitle>
            <CardDescription className="font-medium">
              Ajuster le stock pour{' '}
              <span className="font-bold text-primary">
                {selectedProduct?.name}
              </span>
            </CardDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Type de mouvement
              </Label>
              <Select
                value={movementForm.type}
                onValueChange={(val: StockMovementType) =>
                  setMovementForm({ ...movementForm, type: val })
                }
              >
                <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold">
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem
                    value={StockMovementType.IN_SUPPLY}
                    className="font-bold text-green-600"
                  >
                    Approvisionnement (+)
                  </SelectItem>
                  <SelectItem
                    value={StockMovementType.IN_RETURN}
                    className="font-bold text-green-600"
                  >
                    Retour Client (+)
                  </SelectItem>
                  <SelectItem
                    value={StockMovementType.OUT_LOSS}
                    className="font-bold text-red-600"
                  >
                    Perte / Casse (-)
                  </SelectItem>
                  <SelectItem
                    value={StockMovementType.OUT_EXPIRED}
                    className="font-bold text-red-600"
                  >
                    Péremption (-)
                  </SelectItem>
                  <SelectItem
                    value={StockMovementType.ADJUSTMENT}
                    className="font-bold text-blue-600"
                  >
                    Ajustement Inventaire
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {movementForm.type === StockMovementType.IN_SUPPLY && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Fournisseur
                </Label>
                <Select
                  value={movementForm.supplier}
                  onValueChange={(val) =>
                    setMovementForm({ ...movementForm, supplier: val })
                  }
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold">
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    {suppliers.map((s) => (
                      <SelectItem
                        key={s._id}
                        value={s._id}
                        className="font-semibold"
                      >
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Quantité
                </Label>
                <Input
                  type="number"
                  min="1"
                  className="rounded-xl border-slate-200 h-11 font-black"
                  value={movementForm.quantity}
                  onChange={(e) =>
                    setMovementForm({
                      ...movementForm,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Référence (Optionnel)
                </Label>
                <Input
                  placeholder="N° BL / Facture"
                  className="rounded-xl border-slate-200 h-11 font-medium"
                  value={movementForm.reference}
                  onChange={(e) =>
                    setMovementForm({
                      ...movementForm,
                      reference: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Motif / Justification
              </Label>
              <Input
                placeholder="Ex: Arrivage fournisseur X, Casse lors du déchargement..."
                className="rounded-xl border-slate-200 h-11 font-medium"
                value={movementForm.reason}
                onChange={(e) =>
                  setMovementForm({ ...movementForm, reason: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl font-bold border-slate-200"
              onClick={() => setIsMovementOpen(false)}
            >
              Annuler
            </Button>
            <Button
              className="rounded-xl font-bold shadow-lg"
              onClick={handleSubmitMovement}
              disabled={
                !movementForm.reason ||
                movementForm.quantity < 1 ||
                (movementForm.type === StockMovementType.IN_SUPPLY &&
                  !movementForm.supplier)
              }
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
