'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Topbar from '@/components/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. On crée l'état ici pour qu'il contrôle tout le monde
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // 2. Fonction pour basculer
  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* On passe l'état à la Sidebar pour qu'elle change de largeur */}
      <Sidebar isExpanded={isSidebarExpanded} />

      <div className="flex flex-col flex-1 relative">
        {/* On passe l'état et la fonction à la Topbar */}
        <Topbar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

        {/* Contenu principal : Ajustement du padding-top pour compenser la Topbar fixe */}
        <main
          className={`flex-1 overflow-y-auto p-6 pt-[90px] transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
