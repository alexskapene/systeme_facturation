'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '@/store/slices/authSlice';

export default function AuthHydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Charger les données depuis le localStorage vers Redux
    dispatch(hydrateAuth());

    // Marquer l'application comme prête au prochain cycle
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, [dispatch]);

  // Évite les erreurs d'hydratation Next.js en ne rendant rien
  // tant que le client n'a pas vérifié le localStorage
  if (!isReady) return null;

  return <>{children}</>;
}
