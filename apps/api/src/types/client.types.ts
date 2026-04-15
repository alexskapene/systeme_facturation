import { Document, Types } from 'mongoose';

export enum ClientType {
  PERSONNE_PHYSIQUE = 'PERSONNE_PHYSIQUE',
  PERSONNE_MORALE = 'PERSONNE_MORALE',
}

export interface IClient extends Document {
  name: string; // Nom ou Raison Sociale
  clientType: ClientType;
  nif?: string; // Obligatoire pour les entreprises
  rccm?: string;
  email?: string;
  phone: string;
  address?: string;
  createdBy: Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
