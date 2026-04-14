'use client';

import MainLayout from '../components/layoutsDashboard/MainLayout';
import { AuthProvider } from '../contexts/AuthContext';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
    </AuthProvider>
  );
}
