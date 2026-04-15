import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as clientService from '../services/client.service';
import { Types } from 'mongoose';

export const createClient = async (req: AuthRequest, res: Response) => {
  const client = await clientService.createClient(
    req.body,
    req.user?._id as Types.ObjectId,
  );
  res.status(201).json({ success: true, data: client });
};

export const getClients = async (_req: AuthRequest, res: Response) => {
  const clients = await clientService.getAllClients();
  res.status(200).json({ success: true, data: clients });
};

export const getClient = async (req: AuthRequest, res: Response) => {
  const client = await clientService.getClientById(req.params.id as string);
  res.status(200).json({ success: true, data: client });
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  const client = await clientService.updateClient(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ success: true, data: client });
};

export const toggleStatus = async (req: AuthRequest, res: Response) => {
  const client = await clientService.toggleClientStatus(
    req.params.id as string,
  );
  res
    .status(200)
    .json({ success: true, message: 'Statut mis à jour', data: client });
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  await clientService.deleteClientHard(req.params.id as string);
  res
    .status(200)
    .json({ success: true, message: 'Client supprimé définitivement' });
};
