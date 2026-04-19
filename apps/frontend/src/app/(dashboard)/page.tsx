'use client';

import React, { useEffect } from 'react';
import {
  Users,
  FileText,
  Package,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Euro,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
    <div
      className={cn(
        'h-14 w-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
        iconBg,
        iconColor,
      )}
    >
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-slate-500 mb-1">{title}</span>
      <h3 className="text-3xl font-bold text-[#1e293b]">{value}</h3>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { stats, isLoading, error } = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">
          Chargement des statistiques...
        </p>
      </div>
    );
  }

  const summary = stats?.summary || {
    totalRevenue: 0,
    totalInvoices: 0,
    totalClients: 0,
    lowStockCount: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            Bienvenue, {user?.firstName}..
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Résumé de l'activité commerciale et de l'état des stocks dans votre
            tableau de bord.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm font-medium">
          Impossible de charger les statistiques : {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Chiffre d'Affaires"
          value={`${summary.totalRevenue.toLocaleString()} $`}
          icon={Euro}
          iconBg="bg-blue-600 rounded-full h-12 w-12"
          iconColor="text-white"
        />
        <StatCard
          title="Total Factures"
          value={summary.totalInvoices}
          icon={FileText}
          iconBg="bg-transparent"
          iconColor="text-blue-500 fill-blue-500"
        />
        <StatCard
          title="Total Clients"
          value={summary.totalClients}
          icon={Users}
          iconBg="bg-transparent"
          iconColor="text-blue-600 fill-blue-600"
        />
        <StatCard
          title="Alertes Stock"
          value={summary.lowStockCount}
          icon={AlertTriangle}
          iconBg="bg-transparent"
          iconColor="text-rose-500 fill-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dernières Ventes */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Ventes Récentes
            </CardTitle>
            <Link
              href="/factures"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs font-bold text-muted-foreground uppercase bg-muted/20 border-b">
                  <tr>
                    <th className="px-6 py-4">Facture</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4 text-right">Montant</th>
                    <th className="px-6 py-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats?.recentInvoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-muted-foreground italic"
                      >
                        Aucune vente récente.
                      </td>
                    </tr>
                  ) : (
                    stats?.recentInvoices.map((inv) => (
                      <tr
                        key={inv._id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {inv.client?.firstName} {inv.client?.name}
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-right text-primary">
                          {inv.totalTTC.toLocaleString()} $
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={cn(
                              'px-2.5 py-1 rounded-full text-[11px] font-black uppercase border',
                              inv.status === 'PAID'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : inv.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-rose-100 text-rose-700 border-rose-200',
                            )}
                          >
                            {inv.status === 'PAID'
                              ? 'Payée'
                              : inv.status === 'PENDING'
                                ? 'En attente'
                                : 'Annulée'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alertes Stock Bas */}
        <Card className="border-none shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-rose-50/50">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
              Stock Critique
            </CardTitle>
            <Link
              href="/produit"
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Gérer
            </Link>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="space-y-4">
              {stats?.lowStockProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Package className="h-10 w-10 opacity-20 mb-2" />
                  <p className="text-sm italic">Aucune alerte de stock.</p>
                </div>
              ) : (
                stats?.lowStockProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-rose-500"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">
                        {prod.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Catalogue
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-rose-600">
                        {prod.stockQuantity}
                      </span>
                      <span className="text-[10px] font-medium text-rose-400">
                        RESTANT
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {stats && stats.summary.lowStockCount > 5 && (
              <p className="text-center text-xs font-bold text-muted-foreground mt-4">
                + {stats.summary.lowStockCount - 5} autres produits en alerte
              </p>
            )}
          </CardContent>
          <div className="p-4 bg-muted/20 border-t mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Capacité globale
              </span>
              <span className="text-xs font-black">92%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[92%]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Visual placeholder for Sales trend (CSS Bar Chart) */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Évolution des Ventes (7 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-end justify-between h-40 gap-2">
            {stats?.salesOverTime.map((day) => (
              <div
                key={day._id}
                className="flex flex-col items-center flex-1 group"
              >
                <div
                  className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary transition-all relative"
                  style={{
                    height: `${Math.max(10, (day.amount / (Math.max(...stats.salesOverTime.map((d) => d.amount)) || 1)) * 100)}%`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                    {day.amount.toLocaleString()} $
                  </div>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground mt-2 rotate-45 sm:rotate-0">
                  {new Date(day._id).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                  })}
                </span>
              </div>
            ))}
            {(!stats || stats.salesOverTime.length === 0) && (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-sm">
                Pas assez de données pour générer le graphique.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
