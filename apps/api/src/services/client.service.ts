import { Types } from 'mongoose';
import Client from '../models/Client';
import { IClient } from '../types/client.types';

export const createClient = async (
  clientData: Partial<IClient>,
  userId: Types.ObjectId,
) => {
  // Vérifier si le NIF existe déjà (si fourni)
  if (clientData.nif) {
    const existingClient = await Client.findOne({ nif: clientData.nif });
    if (existingClient) throw new Error('Un client avec ce NIF existe déjà');
  }

  return await Client.create({
    ...clientData,
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
  const client = await Client.findByIdAndUpdate(id, updateData, {
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
