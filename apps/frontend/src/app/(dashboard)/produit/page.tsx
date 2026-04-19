'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  ChevronLeft,
  ChevronRight,
  Pencil,
  Loader2,
  Package,
} from 'lucide-react';
import { Product, CreateProductDTO, ProductCategory } from '@/types/produit';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
} from '@/store/slices/productSlice';
import { fetchSuppliers } from '@/store/slices/supplierSlice';

export default function ProduitsPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector(
    (state) => state.products,
  );
  const { suppliers } = useAppSelector((state) => state.suppliers);

  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    category: ProductCategory.ARTICLE,
    name: '',
    description: '',
    priceHT: '',
    tvaRate: '16',
    stockQuantity: '0',
    minStockQuantity: '0',
    supplier: '',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        category: product.category || ProductCategory.ARTICLE,
        name: product.name,
        description: product.description || '',
        priceHT: String(product.priceHT),
        tvaRate: String(product.tvaRate),
        stockQuantity: String(product.stockQuantity || 0),
        minStockQuantity: String(product.minStockQuantity || 0),
        supplier:
          typeof product.supplier === 'string'
            ? product.supplier
            : product.supplier._id || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        category: ProductCategory.ARTICLE,
        name: '',
        description: '',
        priceHT: '',
        tvaRate: '16',
        stockQuantity: '0',
        minStockQuantity: '0',
        supplier: suppliers.length > 0 ? suppliers[0]._id : '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateProductDTO = {
      category: formData.category,
      name: formData.name,
      description: formData.description,
      supplier: formData.supplier,
      priceHT: parseFloat(formData.priceHT),
      tvaRate: parseFloat(formData.tvaRate),
      stockQuantity:
        formData.category === ProductCategory.ARTICLE
          ? parseInt(formData.stockQuantity)
          : 0,
      minStockQuantity:
        formData.category === ProductCategory.ARTICLE
          ? parseInt(formData.minStockQuantity)
          : 0,
    };

    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct._id, data }));
    } else {
      await dispatch(createProduct(data));
    }

    setIsDialogOpen(false);
  };

  const handleToggleActive = (id: string) => {
    dispatch(toggleProductStatus(id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Catalogue Produits
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Produit
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct
                  ? 'Modifier le produit'
                  : 'Ajouter un nouveau produit'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel>Catégorie</FieldLabel>
                  <Select
                    value={formData.category}
                    onValueChange={(value: ProductCategory) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProductCategory.ARTICLE}>
                        Article (Physique)
                      </SelectItem>
                      <SelectItem value={ProductCategory.SERVICE}>
                        Service (Prestation)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Nom du produit / service</FieldLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Sac de Ciment"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description du produit..."
                  />
                </Field>

                <Field>
                  <FieldLabel>Fournisseur</FieldLabel>
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) =>
                      setFormData({ ...formData, supplier: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Prix HT ($)</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.priceHT}
                      onChange={(e) =>
                        setFormData({ ...formData, priceHT: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>TVA (%)</FieldLabel>
                    <Input
                      type="number"
                      value={formData.tvaRate}
                      onChange={(e) =>
                        setFormData({ ...formData, tvaRate: e.target.value })
                      }
                      required
                    />
                  </Field>
                </div>

                {formData.category === ProductCategory.ARTICLE && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
                    <Field>
                      <FieldLabel>Stock Initial</FieldLabel>
                      <Input
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stockQuantity: e.target.value,
                          })
                        }
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Stock Min Alert</FieldLabel>
                      <Input
                        type="number"
                        value={formData.minStockQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minStockQuantity: e.target.value,
                          })
                        }
                        required
                      />
                    </Field>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProduct
                    ? 'Enregistrer les modifications'
                    : 'Ajouter au catalogue'}
                </Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm border border-destructive/20">
          {error}
        </div>
      )}

      {/* Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold text-foreground">
                  Produit
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Prix HT
                </TableHead>
                <TableHead className="font-bold text-foreground text-center">
                  TVA
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Prix TTC
                </TableHead>
                <TableHead className="font-bold text-foreground text-center">
                  Stock
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Statut
                </TableHead>
                <TableHead className="text-right font-bold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-bold">{product.name}</div>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] font-bold py-0 h-5',
                              product.category === ProductCategory.SERVICE
                                ? 'bg-purple-50 text-purple-600 border-purple-100'
                                : 'bg-blue-50 text-blue-600 border-blue-100',
                            )}
                          >
                            {product.category === ProductCategory.SERVICE
                              ? 'Service'
                              : 'Article'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {product.description || 'Pas de description'}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>${product.priceHT.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {product.tvaRate}%
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      ${product.priceTTC.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.category === ProductCategory.ARTICLE ? (
                        <span
                          className={`font-bold ${product.stockQuantity <= product.minStockQuantity ? 'text-destructive' : ''}`}
                        >
                          {product.stockQuantity}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={product.active}
                          onCheckedChange={() =>
                            handleToggleActive(product._id)
                          }
                        />
                        <span
                          className={`text-sm font-medium ${
                            product.active ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {product.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(product)}
                        className="hover:text-primary transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-20 text-muted-foreground"
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span>Chargement du catalogue...</span>
                      </div>
                    ) : (
                      'Aucun produit trouvé dans le catalogue'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Affichage de {paginatedProducts.length} sur {products.length}{' '}
              produits
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Préc.
              </Button>

              <div className="text-sm font-medium">
                {currentPage} / {totalPages || 1}
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
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
