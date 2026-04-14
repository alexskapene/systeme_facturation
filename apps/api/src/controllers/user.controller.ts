import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res
    .status(201)
    .json({ success: true, message: 'Utilisateur créé', data: user });
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ success: true, data: users });
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id as string);
  res.status(200).json({ success: true, data: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.updateUser(id as string, req.body);
  res
    .status(200)
    .json({ success: true, message: 'Utilisateur mis à jour', data: user });
};

export const toggleStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.toggleUserStatus(id as string);
  const status = user.actif ? 'activé' : 'désactivé';
  res.status(200).json({
    success: true,
    message: `Compte ${status} avec succès`,
    data: user,
  });
};
