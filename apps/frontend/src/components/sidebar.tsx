'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import logo from '../assets/logo_eTax.png';
import {
  Home,
  Users,
  FileText,
  Package,
  Settings,
  LogOut,
  ArrowLeftRight,
  BarChart3,
  CirclePile,
  UsersRound,
  IdCardLanyard,
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
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        'flex flex-col bg-primary border-r transition-all duration-300',
        isExpanded ? 'w-[250px]' : 'w-[80px]',
      )}
    >
      {/* Logo */}
      <div className=" w-full flex items-start font-bold gap-3 p-4 pb-5 border-b border-secondary/25">
        <Image src={logo} alt="Logo" className="h-7 w-5 invert brightness-0" />
        {isExpanded && (
          <span className=" text-secondary">eTax Facturation RDC</span>
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

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center text-secondary gap-3 w-full "
        >
          <LogOut className="h-5 w-5" />
          {isExpanded && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
