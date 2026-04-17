'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Topbar from '@/components/navbar';
import { AuthProvider } from '@/lib/auth-context'; // Assure-toi de l'import

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  return (
    <AuthProvider>
      {' '}
      {/* Ouvre le provider ici */}
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar avec état contrôlé */}
        <Sidebar isExpanded={isSidebarExpanded} />

        <div className="flex flex-col flex-1 relative">
          {/* Topbar fixe ou non selon ton besoin */}
          <Topbar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

          {/* Contenu principal */}
          <main className="flex-1 overflow-y-auto p-6 transition-all duration-300 ">
            {/* Note : Si ta Topbar est en 'fixed', laisse le pt-[90px], sinon p-6 suffit */}
            <div className="max-w-7xl mx-auto pt-[90px]">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
