'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/logo_eTax.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  // Si déjà connecté, on redirige
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full md:w-1/2 h-auto  bg-secondary  rounded-2xl shadow-xl p-20">
        <div className="flex flex-col justify-center items-center text-center space-y-4 mb-8">
          <Image src={logo} alt="Logo eTax" width={50} height={50} />
          <h1 className="text-3xl font-extrabold text-primary ">
            eTax <span className="font-semibold">facturation</span>RDC
          </h1>
          <p className="text-secondary-foreground mt-2">
            Accès au portail de facturation
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full px-12 space-y-5 ">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/75 outline-none transition-all"
              placeholder="admin@etax.cd"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/75 outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/75 disabled:bg-primary-foreground transition-colors shadow-lg shadow-primary"
          >
            {isLoading ? 'Authentification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
