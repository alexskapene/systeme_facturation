'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Email invalide');
      return;
    }

    if (password.length < 6) {
      setError('Mot de passe minimum 6 caractères');
      return;
    }

    // MOCK LOGIN
    if (remember) {
      localStorage.setItem('email', email);
      localStorage.setItem('loggedIn', 'true');
    } else {
      sessionStorage.setItem('loggedIn', 'true');
    }

    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[380px]">
        <CardContent className="space-y-4 pt-6">
          {/* TITLE */}
          <h1 className="text-2xl font-bold text-center">Connexion</h1>

          {/* ERROR */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* EMAIL */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <Label>Mot de passe</Label>
            <Input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CHECKBOX */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-black"
            />
            <label>Retenir mes informations</label>
          </div>

          {/* BUTTON */}
          <Button className="w-full" onClick={handleSubmit}>
            Se connecter
          </Button>

          {/* FOOTER */}
          <p className="text-sm text-center text-gray-600">
            Vous n&apos;avez pas de compte ?{' '}
            <a
              href="/register"
              className="text-black font-medium hover:underline"
            >
              Inscrivez-vous
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
