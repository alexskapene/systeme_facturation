'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { Plus, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { products as initialProducts, type Product } from '@/types/produit';

export default function ProduitsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    priceHT: '',
    tvaRate: '16',
    stockQuantity: '',
  });

  const itemsPerPage = 10;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        priceHT: String(product.priceHT),
        tvaRate: String(product.tvaRate),
        stockQuantity: String(product.stockQuantity),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        priceHT: '',
        tvaRate: '16',
        stockQuantity: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceHT = parseFloat(formData.priceHT);
    const tvaRate = parseFloat(formData.tvaRate);
    const stockQuantity = parseInt(formData.stockQuantity);

    const priceTTC = priceHT + (priceHT * tvaRate) / 100;

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                priceHT,
                tvaRate,
                priceTTC,
                stockQuantity,
              }
            : p,
        ),
      );
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        name: formData.name,
        description: '',
        priceHT,
        tvaRate,
        priceTTC,
        stockQuantity,
        active: true,
      };

      setProducts([...products, newProduct]);
    }

    setIsDialogOpen(false);
    setFormData({
      name: '',
      priceHT: '',
      tvaRate: '16',
      stockQuantity: '',
    });
  };

  // const handleDelete = (id: string) => {
  //   setProducts(products.filter((p) => p.id !== id))
  // }

  const handleToggleActive = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter Produit
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Nom</FieldLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Prix HT ($)</FieldLabel>
                  <Input
                    type="number"
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

                <Field>
                  <FieldLabel>Stock</FieldLabel>
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

                <Button type="submit" className="w-full">
                  {editingProduct ? 'Modifier' : 'Ajouter'}
                </Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Prix HT</TableHead>
                <TableHead>TVA</TableHead>
                <TableHead>Prix TTC</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>

                  <TableCell>{product.priceHT.toFixed(2)}</TableCell>
                  <TableCell>{product.tvaRate}%</TableCell>
                  <TableCell>{product.priceTTC.toFixed(2)}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={product.active}
                        onCheckedChange={() => handleToggleActive(product.id)}
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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm">
              Page {currentPage} sur {totalPages || 1}
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prec.
              </Button>

              <Select value={String(itemsPerPage)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 lignes</SelectItem>
                  <SelectItem value="20">20 lignes</SelectItem>
                  <SelectItem value="50">50 lignes</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage >= totalPages}
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
