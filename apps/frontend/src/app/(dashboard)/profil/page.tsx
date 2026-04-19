'use client';

import { useAppSelector } from '@/hooks/redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getRoleLabel } from '@/types/user';
import {
  Mail,
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header / Hero Section */}
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-primary/80 to-blue-600 overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>

      <div className="relative px-6 -mt-24">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="relative group">
            <Avatar className="h-36 w-36 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-100">
              <AvatarFallback className="text-4xl font-black bg-slate-100 text-primary">
                {user.firstName[0]}
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50">
              <Camera size={18} className="text-slate-600" />
            </button>
          </div>

          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  {user.firstName} {user.name}
                </h1>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  {getRoleLabel(user.role)}
                </p>
              </div>
              <Button className="rounded-xl gap-2 font-bold shadow-md">
                <Edit size={18} />
                Modifier le profil
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                Coordonnées
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Email
                  </span>
                  <span className="text-sm font-semibold">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Téléphone
                  </span>
                  <span className="text-sm font-semibold italic text-slate-400">
                    Non renseigné
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Adresse
                  </span>
                  <span className="text-sm font-semibold italic text-slate-400">
                    RDC, Kinshasa
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-primary" />
                  <span className="text-sm font-bold text-slate-700">
                    Statut du compte
                  </span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 font-bold uppercase text-[10px]">
                  Actif
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                Informations Système
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Nom de famille
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border border-slate-100">
                    {user.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Prénom
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border border-slate-100">
                    {user.firstName}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Rôle Utilisateur
                  </label>
                  <div className="p-3 bg-primary/5 rounded-xl font-bold text-primary border border-primary/10 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    {user.role}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Membre depuis
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border border-slate-100 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    {user.createdAt
                      ? new Intl.DateTimeFormat('fr-FR', {
                          month: 'long',
                          year: 'numeric',
                        }).format(new Date(user.createdAt))
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
