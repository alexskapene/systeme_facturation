'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AuthProvider from './AuthProvider';
import AuthHydrator from './AuthHydrator';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* Hydrator en premier pour remplir le store avant que le reste ne lise */}
      <AuthHydrator>
        <AuthProvider>{children}</AuthProvider>
      </AuthHydrator>
    </Provider>
  );
}
