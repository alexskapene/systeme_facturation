export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  COMPTABLE = 'COMPTABLE',
  GESTIONNAIRE = 'GESTIONNAIRE',
  AGENT_VENTE = 'AGENT_VENTE',
}

export interface User {
  _id: string;
  name: string;
  firstName: string;
  email: string;
  role: Role;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  firstName: string;
  email: string;
  password?: string;
  role: Role;
}

export type UpdateUserDTO = Partial<CreateUserDTO>;

export interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export function getRoleLabel(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
      return 'Super Admin';
    case Role.ADMIN:
      return 'Administrateur';
    case Role.COMPTABLE:
      return 'Comptable';
    case Role.GESTIONNAIRE:
      return 'Gestionnaire';
    case Role.AGENT_VENTE:
      return 'Agent de vente';
    default:
      return role;
  }
}

export function getRoleColor(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case Role.ADMIN:
      return 'bg-red-100 text-red-700 border-red-200';
    case Role.COMPTABLE:
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case Role.GESTIONNAIRE:
      return 'bg-green-100 text-green-700 border-green-200';
    case Role.AGENT_VENTE:
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
