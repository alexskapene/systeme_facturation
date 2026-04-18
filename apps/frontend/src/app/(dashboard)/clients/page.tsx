'use client';

import { useState, useEffect } from 'react';
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
import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { type Client, ClientType } from '@/types/clients';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchClients,
  createClient,
  updateClient,
  toggleClientStatus,
} from '@/store/slices/clientSlice';

export default function ClientsPage() {
  const dispatch = useAppDispatch();
  const { clients, isLoading, error } = useAppSelector(
    (state) => state.clients,
  );

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    clientType: ClientType.PERSONNE_PHYSIQUE,
    nif: '',
    rccm: '',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search) ||
      client.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address || '',
        clientType: client.clientType,
        nif: client.nif || '',
        rccm: client.rccm || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        clientType: ClientType.PERSONNE_PHYSIQUE,
        nif: '',
        rccm: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      await dispatch(updateClient({ id: editingClient._id, data: formData }));
    } else {
      await dispatch(createClient(formData));
    }
    setIsDialogOpen(false);
  };

  const handleToggleActive = (id: string) => {
    dispatch(toggleClientStatus(id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Clients</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4 " />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingClient
                  ? 'Modifier le client'
                  : 'Ajouter un nouveau client'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="clientType">Type de Client</FieldLabel>
                  <Select
                    value={formData.clientType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        clientType: value as ClientType,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ClientType.PERSONNE_PHYSIQUE}>
                        Personne Physique
                      </SelectItem>
                      <SelectItem value={ClientType.PERSONNE_MORALE}>
                        Personne Morale
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Nom / Raison Sociale</FieldLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nom du client"
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
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
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+243..."
                      required
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="address">Adresse</FieldLabel>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Gombe, Kinshasa"
                    required
                  />
                </Field>
                {formData.clientType === ClientType.PERSONNE_MORALE && (
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <Field>
                      <FieldLabel htmlFor="nif">NIF</FieldLabel>
                      <Input
                        id="nif"
                        value={formData.nif}
                        onChange={(e) =>
                          setFormData({ ...formData, nif: e.target.value })
                        }
                        placeholder="NIF"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="rccm">RCCM</FieldLabel>
                      <Input
                        id="rccm"
                        value={formData.rccm}
                        onChange={(e) =>
                          setFormData({ ...formData, rccm: e.target.value })
                        }
                        placeholder="RCCM"
                      />
                    </Field>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingClient ? 'Modifier' : 'Ajouter'}
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
                placeholder="Recherche par nom, email ou tel..."
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-bold">{client.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {client.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {client.clientType === ClientType.PERSONNE_PHYSIQUE
                          ? 'Physique'
                          : 'Morale'}
                      </span>
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={client.active}
                          onCheckedChange={() => handleToggleActive(client._id)}
                        />
                        <span
                          className={`text-sm font-medium ${
                            client.active ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {client.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(client)}
                      >
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    {isLoading ? 'Chargement...' : 'Aucun client trouvé'}
                  </TableCell>
                </TableRow>
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
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Préc.
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages || totalPages === 0}
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
