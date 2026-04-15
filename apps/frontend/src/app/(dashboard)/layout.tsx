import React from 'react';
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar : Structure fixe à gauche */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header : Barre supérieure avec infos utilisateur */}
        {/* <Header /> */}

        {/* Contenu principal : Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
