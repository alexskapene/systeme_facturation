'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/lib/useLogout';
import React from 'react';

import { Menu, User as LogOut, Settings, UserCircle } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { getRoleLabel } from '@/types/user';
import Link from 'next/link';

interface TopbarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Topbar({ isExpanded, onToggle }: TopbarProps) {
  const logout = useLogout();
  const { user } = useAppSelector((state) => state.auth);
  const [openLogout, setOpenLogout] = React.useState(false);

  return (
    <>
      <header
        className={`
          fixed top-0 right-0 z-50 flex h-[70px] items-center justify-between border-b bg-white px-4 md:px-8 transition-all duration-300 ease-in-out
          ${isExpanded ? 'left-[260px]' : 'left-[80px]'}
        `}
      >
        {/* LEFT */}
        <div className="flex items-center">
          <Button
            onClick={onToggle}
            variant="secondary"
            size="icon"
            className="h-10 w-10 bg-[#f3f4f6] hover:bg-gray-200 border-none transition-transform active:scale-95"
          >
            <Menu className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          {/* USER MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-xl px-2 h-14 border-none focus-visible:ring-0 transition-all"
              >
                <Avatar className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {user?.firstName?.[0]}
                    {user?.name?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-slate-800">
                    {user ? `${user.firstName} ${user.name}` : 'Utilisateur'}
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    {user ? getRoleLabel(user.role) : 'Chargement...'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 mt-2 rounded-2xl shadow-xl p-2 border-none"
            >
              <div className="px-3 py-4 flex items-center gap-3 bg-slate-50 rounded-xl mb-2">
                <Avatar className="h-12 w-12 rounded-full border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-primary text-white font-bold">
                    {user?.firstName?.[0]}
                    {user?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-slate-800 truncate">
                    {user?.firstName} {user?.name}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate lowercase italic">
                    {user?.email}
                  </span>
                </div>
              </div>

              <DropdownMenuLabel className="text-[10px] font-black text-slate-400 px-3 py-2 uppercase tracking-widest">
                Navigation
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-slate-100" />

              <Link href="/profil">
                <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 focus:bg-primary/5 focus:text-primary transition-colors gap-3">
                  <UserCircle className="h-4 w-4" />
                  <span className="font-semibold text-sm">Mon Profil</span>
                </DropdownMenuItem>
              </Link>

              <Link href="/parametres">
                <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 focus:bg-primary/5 focus:text-primary transition-colors gap-3">
                  <Settings className="h-4 w-4" />
                  <span className="font-semibold text-sm">Paramètres</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator className="bg-slate-100" />

              <DropdownMenuItem
                onClick={() => setOpenLogout(true)}
                className="cursor-pointer rounded-xl py-2.5 text-red-500 font-bold focus:bg-red-50 focus:text-red-600 transition-colors gap-3"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ===================== */}
      {/* LOGOUT CONFIRM MODAL  */}
      {/* ===================== */}
      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation de déconnexion</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenLogout(false)}>
              Annuler
            </Button>

            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                logout();
                setOpenLogout(false);
              }}
            >
              Déconnexion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
