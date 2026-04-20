import { Types } from 'mongoose';
import Client from '../models/Client';
import { IClient } from '../types/client.types';

export const createClient = async (
  clientData: Partial<IClient>,
  userId: Types.ObjectId,
) => {
  // Nettoyer les chaines vides pour éviter les collisions d'index unique (NIF)
  const sanitizedData = { ...clientData };
  if (sanitizedData.nif === '') delete sanitizedData.nif;
  if (sanitizedData.rccm === '') delete sanitizedData.rccm;

  // Vérifier si le NIF existe déjà (si fourni)
  if (sanitizedData.nif) {
    const existingClient = await Client.findOne({ nif: sanitizedData.nif });
    if (existingClient) throw new Error('Un client avec ce NIF existe déjà');
  }

  return await Client.create({
    ...sanitizedData,
    createdBy: userId,
  });
};

export const getAllClients = async () => {
  return await Client.find()
    .populate('createdBy', 'name firstName')
    .sort({ createdAt: -1 });
};

export const getClientById = async (id: string) => {
  const client = await Client.findById(id).populate(
    'createdBy',
    'name firstName',
  );
  if (!client) throw new Error('Client introuvable');
  return client;
};

export const updateClient = async (
  id: string,
  updateData: Partial<IClient>,
) => {
  const sanitizedData = { ...updateData };
  if (sanitizedData.nif === '') delete sanitizedData.nif;
  if (sanitizedData.rccm === '') delete sanitizedData.rccm;

  const client = await Client.findByIdAndUpdate(id, sanitizedData, {
    new: true,
    runValidators: true,
  });
  if (!client) throw new Error('Client introuvable');
  return client;
};

export const toggleClientStatus = async (id: string) => {
  const client = await Client.findById(id);
  if (!client) throw new Error('Client introuvable');
  client.active = !client.active;
  return await client.save();
};

export const deleteClientHard = async (id: string) => {
  const client = await Client.findByIdAndDelete(id);
  if (!client) throw new Error('Client introuvable.');
  return client;
};
