export interface EntityState<T> {
  items: T[];
  item: T | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
