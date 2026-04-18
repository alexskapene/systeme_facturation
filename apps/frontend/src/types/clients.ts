export enum ClientType {
  PERSONNE_PHYSIQUE = 'PERSONNE_PHYSIQUE',
  PERSONNE_MORALE = 'PERSONNE_MORALE',
}

export interface Client {
  _id: string;
  name: string; // Nom ou Raison Sociale
  clientType: ClientType;
  nif?: string;
  rccm?: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDTO {
  name: string;
  clientType: ClientType;
  nif?: string;
  rccm?: string;
  email: string;
  phone: string;
  address: string;
}

export type UpdateClientDTO = Partial<CreateClientDTO>;

export interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  isLoading: boolean;
  error: string | null;
}
