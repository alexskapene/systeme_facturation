'use client';

import React from 'react';
import { Bell, Menu, ChevronDown } from 'lucide-react';

// Importations utilisant UNIQUEMENT tes composants déjà présents
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Topbar() {
  return (
    <header className="flex h-[70px] w-full items-center justify-between border-b bg-white px-4 md:px-8 dark:bg-slate-950">
      {/* CÔTÉ GAUCHE : Bouton Menu (Style exact de la capture) */}
      <div className="flex items-center">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 bg-[#f3f4f6] hover:bg-gray-200 dark:bg-slate-800 border-none"
        >
          <Menu className="h-5 w-5 text-slate-500" />
        </Button>
      </div>

      {/* CÔTÉ DROIT : Notifications + Profil Admin */}
      <div className="flex items-center gap-4">
        {/* Notifications avec ton composant Badge */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
          >
            <Bell className="h-6 w-6 text-slate-500" />
          </Button>
          {/* Badge rouge positionné sur l'icône */}
          <Badge className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e14d4d] p-0 text-[10px] font-bold text-white border-2 border-white hover:bg-[#e14d4d]">
            1
          </Badge>
        </div>

        {/* Bloc Utilisateur (Fidèle à l'image) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 bg-[#f3f4f6] px-3 py-6 hover:bg-gray-200 dark:bg-slate-800 focus-visible:ring-0"
            >
              {/* Avatar avec bords arrondis (rounded-md) comme sur la photo */}
              <Avatar className="h-9 w-9 rounded-md">
                <AvatarImage
                  src="https://avatar.iran.liara.run/public/30"
                  alt="Admin"
                />
                <AvatarFallback className="rounded-md">AD</AvatarFallback>
              </Avatar>

              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Admin
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>

          {/* Contenu du menu déroulant */}
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 font-medium">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
