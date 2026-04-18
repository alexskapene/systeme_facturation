'use client';

import { useState, useEffect } from 'react';
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
import {
  Search,
  Pencil,
  Loader2,
  UserPlus,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { User, Role, getRoleLabel, getRoleColor } from '@/types/user';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  clearError,
} from '@/store/slices/userSlice';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.users);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    email: '',
    password: '',
    role: Role.AGENT_VENTE as Role,
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenDialog = (user?: User) => {
    dispatch(clearError()); // Effacer les erreurs précédentes
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        firstName: user.firstName,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        firstName: '',
        email: '',
        password: '',
        role: Role.AGENT_VENTE,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        const updateData = {
          name: formData.name,
          firstName: formData.firstName,
          email: formData.email,
          role: formData.role,
        };
        await dispatch(
          updateUser({ id: editingUser._id, data: updateData }),
        ).unwrap();
      } else {
        await dispatch(createUser(formData)).unwrap();
      }

      // Fermer le dialogue et rafraîchir la liste pour être sûr d'avoir les données du serveur
      setIsDialogOpen(false);
      dispatch(fetchUsers());
    } catch (err) {
      // L'erreur est déjà gérée dans le slice et affichée dans le composant
      console.error("Erreur lors de l'enregistrement:", err);
    }
  };

  const handleToggleActif = (userId: string) => {
    dispatch(toggleUserStatus(userId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Administration Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les accès et les rôles de votre équipe
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shadow-md">
          <UserPlus className="mr-2 h-4 w-4" />
          Nouvel Utilisateur
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-destructive/15 text-destructive p-3 rounded-lg text-sm border border-destructive/20">
              {error}
            </div>
          )}

          {/* Users Table */}
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Utilisateur</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Rôle</TableHead>
                  <TableHead className="text-center font-bold">
                    Statut
                  </TableHead>
                  <TableHead className="text-right px-6 font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-muted-foreground">
                          Chargement des utilisateurs...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-20 text-muted-foreground"
                    >
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user.firstName[0]}
                            {user.name[0]}
                          </div>
                          <div>
                            <div className="font-bold">
                              {user.firstName} {user.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Membre depuis{' '}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border',
                            getRoleColor(user.role),
                          )}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {getRoleLabel(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={user.actif}
                            onCheckedChange={() => handleToggleActif(user._id)}
                          />
                          <span
                            className={cn(
                              'text-xs font-medium',
                              user.actif
                                ? 'text-green-600'
                                : 'text-muted-foreground',
                            )}
                          >
                            {user.actif ? 'Actif' : 'Bloqué'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(user)}
                          className="hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Total : {filteredUsers.length} utilisateur
            {filteredUsers.length > 1 ? 's' : ''}
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
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Ex: John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@company.com"
              />
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe provisoire</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Minimum 6 caractères"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Rôle et permissions</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as Role })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingUser ? 'Mettre à jour' : 'Créer le compte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
