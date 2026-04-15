import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Dans Next.js 16+, si le fichier s'appelle proxy.ts,
 * la fonction exportée doit s'appeler 'proxy' ou être l'export par défaut.
 */
export function proxy(request: NextRequest) {
  // Récupération du token depuis les cookies
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. PROTECTION DES ROUTES PRIVÉES
  // Si l'utilisateur n'est pas connecté et tente d'accéder à autre chose que le login
  if (!token && pathname !== '/login') {
    // On redirige vers la page de connexion
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. REDIRECTION DES UTILISATEURS CONNECTÉS
  // Si l'utilisateur est déjà connecté et tente d'aller sur /login
  if (token && pathname === '/login') {
    // On le renvoie vers le dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Autoriser la requête si aucune condition de redirection n'est remplie
  return NextResponse.next();
}

// Configuration du matcher (inchangée)
export const config = {
  matcher: [
    /*
     * Matcher toutes les routes sauf les fichiers statiques, images et favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
