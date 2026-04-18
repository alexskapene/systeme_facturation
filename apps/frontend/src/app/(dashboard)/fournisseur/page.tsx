'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Search, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
} from '@/store/slices/supplierSlice';
import { type Supplier } from '@/types/suppliers';

export default function FournisseursPage() {
  const dispatch = useAppDispatch();
  const { suppliers, isLoading, error } = useAppSelector(
    (state) => state.suppliers,
  );

  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nif: '',
    rccm: '',
    address: '',
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const filteredSuppliers = suppliers.filter((supplier) =>
    [
      supplier.name,
      supplier.email,
      supplier.phone,
      supplier.nif,
      supplier.rccm ?? '',
      supplier.address,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        nif: supplier.nif,
        rccm: supplier.rccm ?? '',
        address: supplier.address,
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        nif: '',
        rccm: '',
        address: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingSupplier) {
      await dispatch(
        updateSupplier({ id: editingSupplier._id, data: formData }),
      );
    } else {
      await dispatch(createSupplier(formData));
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Fournisseurs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="transition-transform duration-150 ease-out transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:shadow-inner"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSupplier
                  ? 'Modifier le fournisseur'
                  : 'Ajouter un nouveau fournisseur'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nom du fournisseur"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@exemple.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+243..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nif">NIF</Label>
                    <Input
                      id="nif"
                      value={formData.nif}
                      onChange={(e) =>
                        setFormData({ ...formData, nif: e.target.value })
                      }
                      placeholder="NIF (ex: A1234567B)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rccm">RCCM</Label>
                    <Input
                      id="rccm"
                      value={formData.rccm}
                      onChange={(e) =>
                        setFormData({ ...formData, rccm: e.target.value })
                      }
                      placeholder="RCCM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Adresse complète"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingSupplier ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
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
                placeholder="Recherche par nom, nif, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="recent">Récents</SelectItem>
                  <SelectItem value="oldest">Anciens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-4 pb-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Liste des fournisseurs
              </h2>
              <p className="text-sm text-muted-foreground">
                Affiche les fournisseurs enregistrés avec leurs informations.
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredSuppliers.length} fournisseur
              {filteredSuppliers.length > 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>RCCM</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier._id}>
                    <TableCell className="font-medium">
                      {supplier.name}
                    </TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.nif}</TableCell>
                    <TableCell>{supplier.rccm ?? '-'}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(supplier)}
                      >
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    {isLoading ? 'Chargement...' : 'Aucun fournisseur trouvé.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
