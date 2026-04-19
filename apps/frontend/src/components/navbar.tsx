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

import { Bell, Menu, User } from 'lucide-react';

interface TopbarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Topbar({ isExpanded, onToggle }: TopbarProps) {
  const logout = useLogout();
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
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-11 w-11"
            >
              <Bell className="h-7 w-7 text-[#4b5563] fill-[#4b5563]" />
            </Button>
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e14d4d] text-[10px] font-bold text-white border-[2.5px] border-white shadow-sm">
              1
            </span>
          </div>

          {/* USER MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-xl px-2 h-14 border-none focus-visible:ring-0 transition-all"
              >
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  <AvatarFallback className="rounded-lg bg-slate-200">
                    <User className="h-10 w-10 text-slate-500" />{' '}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-slate-800">
                    Admin
                  </span>
                  <span className="text-xs text-slate-500">Administrateur</span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 rounded-xl shadow-lg p-2"
            >
              <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">
                Mon Compte
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-slate-100" />

              <DropdownMenuItem className="cursor-pointer rounded-lg py-2 focus:bg-slate-50">
                Profil
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer rounded-lg py-2 focus:bg-slate-50">
                Paramètres
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-100" />

              {/* 👇 ON OUVRE LE MODAL AU LIEU DE LOGOUT DIRECT */}
              <DropdownMenuItem
                onClick={() => setOpenLogout(true)}
                className="cursor-pointer rounded-lg py-2 text-red-500 font-semibold focus:bg-red-50 focus:text-red-500"
              >
                Déconnexion
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
