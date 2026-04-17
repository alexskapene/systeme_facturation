'use client';

import { useState, type FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Search } from 'lucide-react';

type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  nif?: string;
  rccm?: string;
  address?: string;
  createdBy?: string;
  active?: boolean;
  createdAt: string;
};

const initialSuppliers: Supplier[] = [];

export default function FournisseursPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
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

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email ?? '',
        phone: supplier.phone,
        nif: supplier.nif ?? '',
        rccm: supplier.rccm ?? '',
        address: supplier.address ?? '',
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingSupplier) {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === editingSupplier.id
            ? { ...supplier, ...formData }
            : supplier,
        ),
      );
    } else {
      const newSupplier: Supplier = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      nif: '',
      rccm: '',
      address: '',
    });
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
                      placeholder="123-456-789"
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
                      placeholder="NIF du fournisseur"
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
                      placeholder="RCCM du fournisseur"
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
                      placeholder="Adresse du fournisseur"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
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
                placeholder="Recherche des fournisseurs ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                Tous
              </Button>
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

      {/* Formulaire d'insertion */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Insertion de fournisseur
              </h2>
              <p className="text-sm text-muted-foreground">
                Remplissez le formulaire ci-dessous pour ajouter un fournisseur.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog()}
              className="transition-transform duration-150 ease-out transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:shadow-inner"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ouvrir la modification
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
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
                  placeholder="123-456-789"
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
                  placeholder="NIF du fournisseur"
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
                  placeholder="RCCM du fournisseur"
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
                  placeholder="Adresse du fournisseur"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="mt-4 w-full transition-transform duration-150 ease-out transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:shadow-inner"
            >
              {editingSupplier
                ? 'Modifier le fournisseur'
                : 'Ajouter le fournisseur'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
