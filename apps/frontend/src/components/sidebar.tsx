'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  Home,
  Users,
  FileText,
  Package,
  Settings,
  LogOut,
  Receipt,
  ShoppingCart,
  Truck,
  ArrowLeftRight,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/factures', label: 'Factures', icon: FileText },
  { href: '/dashboard/produits', label: 'Produits', icon: Package },
  {
    href: '/dashboard/approvisionnement',
    label: 'Approvisionnement',
    icon: Truck,
  },
  { href: '/dashboard/ventes', label: 'Ventes', icon: ShoppingCart },
  {
    href: '/dashboard/transactions',
    label: 'TransactionStock',
    icon: ArrowLeftRight,
  },
  { href: '/dashboard/rapports', label: 'Rapport', icon: BarChart3 },
  { href: '/dashboard/parametres', label: 'Parametres', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay - only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 lg:relative',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible, just change width
          'lg:translate-x-0',
          isOpen ? 'w-64' : 'lg:w-20',
        )}
      >
        {/* Logo - Fixed at top */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-4 border-b border-sidebar-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
            <Receipt className="h-5 w-5" />
          </div>
          <span
            className={cn(
              'text-lg font-semibold whitespace-nowrap transition-opacity duration-300',
              isOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden',
            )}
          >
            systeme_facturation
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!isOpen ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                    !isOpen && 'lg:justify-center lg:px-2',
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span
                    className={cn(
                      'truncate transition-opacity duration-300',
                      isOpen ? 'opacity-100' : 'lg:hidden',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout - Fixed at bottom */}
        <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
          <button
            onClick={logout}
            title={!isOpen ? 'Deconnexion' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              !isOpen && 'lg:justify-center lg:px-2',
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                'truncate transition-opacity duration-300',
                isOpen ? 'opacity-100' : 'lg:hidden',
              )}
            >
              Deconnexion
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
