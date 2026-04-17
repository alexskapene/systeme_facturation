'use client';

import React from 'react';
import { Bell, Menu, UserRound, ChevronDown } from 'lucide-react';
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

// On définit les types des props
interface TopbarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Topbar({ isExpanded, onToggle }: TopbarProps) {
  return (
    <header
      className={`
        fixed top-0 right-0 z-50 flex h-[70px] items-center justify-between border-b bg-white px-4 md:px-8 transition-all duration-300 ease-in-out
        ${isExpanded ? 'left-[260px]' : 'left-[80px]'} 
      `}
    >
      {/* CÔTÉ GAUCHE : Bouton Menu qui appelle la fonction onToggle du Layout */}
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

      {/* CÔTÉ DROIT : Ton design exact */}
      <div className="flex items-center gap-6">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 bg-[#f1f5f9] hover:bg-slate-200 rounded-xl px-2 h-14 border-none focus-visible:ring-0 transition-all"
            >
              <Avatar className="h-10 w-10 rounded-lg overflow-hidden">
                <AvatarImage
                  src="/images/Avatar.png"
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg bg-slate-200">
                  <UserRound className="h-5 w-5 text-slate-500" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex items-center gap-10">
                <span className="text-[15px] font-bold text-slate-700">
                  Admin
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
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
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2 text-red-500 font-semibold focus:bg-red-50">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
