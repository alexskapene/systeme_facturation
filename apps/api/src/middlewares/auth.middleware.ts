import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser, Role } from '../types/user.types';

// Interface pour le contenu du Token
interface DecodedToken {
  id: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Accès non autorisé : Aucun token fourni.'));
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as DecodedToken;

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      return next(new Error('Accès non autorisé : Utilisateur introuvable.'));
    }

    if (!user.actif) {
      res.status(401);
      return next(new Error('Accès non autorisé : Compte inactif.'));
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    const err =
      error instanceof Error ? error : new Error("Erreur d'authentification");
    res.status(401);
    next(
      new Error('Accès non autorisé : Token invalide ou expiré.' + err.message),
    );
  }
};

// Utilisation du type Role au lieu de string[] pour plus de sécurité
export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Le rôle [${req.user?.role}] n'est pas autorisé.`));
    }
    next();
  };
};
