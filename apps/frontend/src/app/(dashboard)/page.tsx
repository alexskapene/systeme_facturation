'use client';

import React from 'react';
import { Users, FileText, Package, Euro, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
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

interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: string;
  statusColor: string;
}

interface Product {
  name: string;
  sales: string;
  iconBg: string;
}

const DashboardPage = () => {
  const recentInvoices: Invoice[] = [
    {
      id: 'INV-001',
      client: 'Jean Dupont',
      amount: '€ 500.00',
      status: 'Payée',
      statusColor: 'bg-[#4CAF50] text-white',
    },
    {
      id: 'INV-002',
      client: 'Marie Martin',
      amount: '€ 300.00',
      status: 'En attente',
      statusColor: 'bg-[#ffc107]/80 text-[#856404]',
    },
    {
      id: 'INV-003',
      client: 'Paul Lefevre',
      amount: '€ 750.00',
      status: 'En retard',
      statusColor: 'bg-[#F44336] text-white',
    },
  ];
  const topProducts: Product[] = [
    {
      name: 'Produit A',
      sales: '150 Ventes',
      iconBg: 'bg-blue-50  text-blue-500',
    },
    {
      name: 'Produit B',
      sales: '90 Ventes',
      iconBg: 'bg-amber-50 text-amber-500',
    },
    {
      name: 'Produit C',
      sales: '60 Ventes',
      iconBg: 'bg-rose-50  text-rose-500',
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-[#1e293b]">Tableau de Bord</h1>
        <p className="text-slate-400 font-bold">
          Bienvenue sur le tableau de bord!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value="120"
          icon={Users}
          iconBg="bg-transparent"
          iconColor="text-blue-600 fill-blue-600"
        />
        <StatCard
          title="Total Factures"
          value="75"
          icon={FileText}
          iconBg="bg-transparent"
          iconColor="text-blue-500 fill-blue-500"
        />
        <StatCard
          title="Produits Total"
          value="45"
          icon={Package}
          iconBg="bg-transparent"
          iconColor="text-amber-500 fill-amber-500"
        />
        <StatCard
          title="Revenu Total"
          value="€12,500"
          icon={Euro}
          iconBg="bg-blue-600 rounded-full h-12 w-12"
          iconColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dernières Factures */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-8 py-7 border-b border-slate-50">
            <h3 className="text-xl font-bold text-slate-800">
              Dernières Factures
            </h3>
          </div>

          <div className="px-6 py-4 flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f1f5f9]">
                <tr className="text-sm font-semibold text-slate-600 text-left">
                  <th className="px-6 py-4 rounded-tl-md">Facture</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4 rounded-tr-md">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {recentInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-all"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {inv.client}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {inv.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center px-4 py-1.5 rounded-md text-[13px] font-medium tracking-wide',
                          inv.statusColor,
                        )}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-12 py-6 bg-slate-50/30 border-t border-slate-50">
            <button className="text-blue-500 font-bold text-sm flex items-center gap-2 hover:text-blue-600 transition-colors group">
              Voir toutes
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Top Produits */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-8 px-2">
            Top Produits
          </h3>
          <div className="flex flex-col gap-4">
            {topProducts.map((prod) => (
              <div
                key={prod.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div
                  className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform',
                    prod.iconBg,
                  )}
                >
                  <Package size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1e293b] tracking-tight">
                    {prod.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    {prod.sales}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
