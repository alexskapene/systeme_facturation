import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Veuillez fournir un email et un mot de passe');
  }

  const result = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    message: 'Connexion réussie',
    data: result,
  });
};
