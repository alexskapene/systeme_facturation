import { Role } from './user';

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: null | string;
}
