'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import logo from '../assets/logo_eTax.png';
import { useLogout } from '@/lib/useLogout';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  ArrowLeftRight,
  BarChart3,
  CirclePile,
  FileText,
  Home,
  IdCardLanyard,
  LogOut,
  Package,
  Settings,
  Users,
  UsersRound,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/fournisseur', label: 'Fournisseurs', icon: IdCardLanyard },
  { href: '/produit', label: 'Produits', icon: Package },
  { href: '/factures', label: 'Factures', icon: FileText },
  { href: '/payements', label: 'Payements', icon: ArrowLeftRight },
  { href: '/stock', label: 'Stock', icon: CirclePile },
  { href: '/users', label: 'Utilisateurs', icon: UsersRound },
  { href: '/rapports', label: 'Rapport', icon: BarChart3 },
  { href: '/parametres', label: 'Parametres', icon: Settings },
];

interface SidebarProps {
  isExpanded: boolean;
}

export default function Sidebar({ isExpanded }: SidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();

  const [openLogout, setOpenLogout] = React.useState(false);

  return (
    <>
      <aside
        className={cn(
          'flex flex-col bg-primary border-r transition-all duration-300',
          isExpanded ? 'w-[250px]' : 'w-[80px]',
        )}
      >
        {/* Logo */}
        <div className="w-full flex items-start font-bold gap-3 p-4 pb-5 border-b border-secondary/25">
          <Image
            src={logo}
            alt="Logo"
            className="h-7 w-5 invert brightness-0"
          />
          {isExpanded && (
            <span className="text-secondary">eTax Facturation RDC</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-4 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg',
                  isActive
                    ? 'bg-secondary text-primary'
                    : 'text-secondary hover:bg-secondary/10 hover:text-secondary',
                )}
              >
                <item.icon className="h-5 w-5" />
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t">
          <button
            onClick={() => setOpenLogout(true)}
            className="flex items-center text-red-500 gap-3 w-full"
          >
            <LogOut className="h-5 w-5" />
            {isExpanded && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ===================== */}
      {/* MODAL LOGOUT PROPRE   */}
      {/* ===================== */}
      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Déconnexion</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setOpenLogout(false)}
              className="px-4 py-2 rounded-md border text-sm"
            >
              Annuler
            </button>

            <button
              onClick={() => {
                logout();
                setOpenLogout(false);
              }}
              className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
