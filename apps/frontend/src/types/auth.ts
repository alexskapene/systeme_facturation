export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'COMPTABLE'
  | 'GESTIONNAIRE'
  | 'AGENT_VENTE';

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: null | string;
}
