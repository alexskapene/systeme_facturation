'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

export function useLogout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return () => {
    dispatch(logout());
    router.push('/login');
  };
}
