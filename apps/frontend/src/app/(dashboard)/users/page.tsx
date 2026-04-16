'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  users as initialUsers,
  User,
  Role,
  getRoleLabel,
  getRoleColor,
} from '@/types/user';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    email: '',
    role: Role.AGENT_VENTE as Role,
    actif: true,
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        actif: user.actif,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        firstName: '',
        email: '',
        role: Role.AGENT_VENTE,
        actif: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)),
      );
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
      };
      setUsers([...users, newUser]);
    }
    setIsDialogOpen(false);
  };

  const handleToggleActif = (userId: string, actif: boolean) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, actif } : u)));
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gestion des utilisateurs de la plateforme
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrer par role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les roles</SelectItem>
                  <SelectItem value={Role.SUPER_ADMIN}>Super Admin</SelectItem>
                  <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                  <SelectItem value={Role.COMPTABLE}>Comptable</SelectItem>
                  <SelectItem value={Role.GESTIONNAIRE}>
                    Gestionnaire
                  </SelectItem>
                  <SelectItem value={Role.AGENT_VENTE}>
                    Agent de Vente
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Utilisateur
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prenom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Actif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucun utilisateur trouve
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            getRoleColor(user.role),
                          )}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={user.actif}
                          onCheckedChange={(checked) =>
                            handleToggleActif(user.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredUsers.length} utilisateur
              {filteredUsers.length > 1 ? 's' : ''} trouve
              {filteredUsers.length > 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Prenom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Prenom"
                />
              </div>
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
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as Role })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectionnez un role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.SUPER_ADMIN}>Super Admin</SelectItem>
                  <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                  <SelectItem value={Role.COMPTABLE}>Comptable</SelectItem>
                  <SelectItem value={Role.GESTIONNAIRE}>
                    Gestionnaire
                  </SelectItem>
                  <SelectItem value={Role.AGENT_VENTE}>
                    Agent de Vente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="actif">Compte actif</Label>
              <Switch
                id="actif"
                checked={formData.actif}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, actif: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingUser ? 'Enregistrer' : 'Creer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Etes-vous sur de vouloir supprimer l&apos;utilisateur{' '}
            <strong>
              {userToDelete?.firstName} {userToDelete?.name}
            </strong>{' '}
            ? Cette action est irreversible.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
