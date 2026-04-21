'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/logo_eTax.png';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

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
    if (!email || !password) {
      setErreur('Veuillez remplir tous les champs');
      return;
    } else {
      setErreur(null);
    }
    dispatch(loginUser({ email, password }));
    if (isAuthenticated) {
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full md:w-1/3 h-auto  rounded-2xl bg-secondary/15 px-6 py-12  md:px-8 md:py-12 border backdrop-blur-sm">
        <div className="flex flex-col justify-center items-center text-center space-y-4 mb-8">
          <Image src={logo} alt="Logo eTax" width={50} height={50} />
          <h1 className="text-3xl font-extrabold text-primary ">
            eTax <span className="font-semibold">Facturation</span> RDC
          </h1>
          <p className="text-secondary-foreground text-lg mt-2">
            Accès au portail de facturation
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5 ">
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
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/75 outline-none transition-all"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? (
                <EyeOff
                  className="absolute right-4 top-[38px] text-slate-400 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye className="absolute right-4 top-[38px] text-slate-400 cursor-pointer" />
              )}
            </button>
          </div>
          <div className="h-6">
            <p
              className={`text-red-600 text-center  text-sm ${erreur ? 'block' : 'hidden'}`}
            >
              {erreur}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 disabled:bg-primary-foreground transition-colors shadow-lg shadow-primary"
          >
            {isLoading ? 'Authentification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
