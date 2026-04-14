import Sidebar from '../layoutsDashboard/Sidebar';
import Topbar from '../layoutsDashboard/Navbar';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
