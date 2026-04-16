import { Types } from 'mongoose';
export enum ClientType {
  PERSONNE_PHYSIQUE = 'PERSONNE_PHYSIQUE',
  PERSONNE_MORALE = 'PERSONNE_MORALE',
}

export interface Client {
  id: string;
  name: string; // Nom ou Raison Sociale
  email?: string;
  phone: string;
  address?: string;
  active: boolean;
  createdAt: string;
}

export interface IpClient {
  name: string; // Nom ou Raison Sociale
  clientType: ClientType;
  nif?: string; // Obligatoire pour les entreprises
  rccm?: string;
  email?: string;
  phone: string;
  address?: string;
  createdBy: Types.ObjectId;
  active: boolean;
  createdAt: string;
  updatedAt: Date;
}

export const clients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '653-676-803',
    address: '122 avenue de la mission',
    active: true,
    createdAt: '11/04/2022',
  },
];
