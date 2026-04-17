export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  COMPTABLE = 'COMPTABLE',
  GESTIONNAIRE = 'GESTIONNAIRE',
  AGENT_VENTE = 'AGENT_VENTE',
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: Role;
  actif: boolean;
}

export const users: User[] = [
  {
    id: '1',
    name: 'Doe',
    firstName: 'John',
    email: 'john.doe@example.com',
    role: Role.SUPER_ADMIN,
    actif: true,
  },
  {
    id: '2',
    name: 'Martin',
    firstName: 'Marie',
    email: 'marie.martin@example.com',
    role: Role.ADMIN,
    actif: true,
  },
  {
    id: '3',
    name: 'Dupont',
    firstName: 'Pierre',
    email: 'pierre.dupont@example.com',
    role: Role.COMPTABLE,
    actif: true,
  },
  {
    id: '4',
    name: 'Bernard',
    firstName: 'Sophie',
    email: 'sophie.bernard@example.com',
    role: Role.GESTIONNAIRE,
    actif: false,
  },
  {
    id: '5',
    name: 'Lefevre',
    firstName: 'Lucas',
    email: 'lucas.lefevre@example.com',
    role: Role.AGENT_VENTE,
    actif: true,
  },
];

export function getRoleLabel(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
      return 'Super Admin';
    case Role.ADMIN:
      return 'Admin';
    case Role.COMPTABLE:
      return 'Comptable';
    case Role.GESTIONNAIRE:
      return 'Gestionnaire';
    case Role.AGENT_VENTE:
      return 'Agent de Vente';
  }
}

export function getRoleColor(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
      return 'bg-purple-500 text-white';
    case Role.ADMIN:
      return 'bg-blue-500 text-white';
    case Role.COMPTABLE:
      return 'bg-green-500 text-white';
    case Role.GESTIONNAIRE:
      return 'bg-orange-500 text-white';
    case Role.AGENT_VENTE:
      return 'bg-cyan-500 text-white';
  }
}
