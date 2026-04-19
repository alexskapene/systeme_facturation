// Stock Movement Types
export enum StockMovementType {
  IN_SUPPLY = 'IN_SUPPLY', // Approvisionnement (Entree)
  OUT_SALE = 'OUT_SALE', // Vente (Sortie automatique)
  OUT_LOSS = 'OUT_LOSS', // Perte (Casse, vol)
  OUT_EXPIRED = 'OUT_EXPIRED', // Peremption
  IN_RETURN = 'IN_RETURN', // Retour client
  ADJUSTMENT = 'ADJUSTMENT', // Correction inventaire
}

export interface StockMovement {
  _id: string;
  productId: string | { _id: string; name: string };
  type: StockMovementType;
  quantity: number;
  reason: string;
  performedBy: string | { _id: string; name: string; firstName: string };
  performedByName: string | { _id: string; name: string };
  reference?: string;
  previousStock: number;
  newStock: number;
  createdAt: string;
  updateAt: string;
}

export interface CreateStockMovementDTO {
  product: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  supplier?: string;
  reference?: string;
}

export interface StockState {
  movements: StockMovement[];
  isLoading: boolean;
  error: string | null;
}

export function getStockMovementTypeLabel(type: StockMovementType): string {
  switch (type) {
    case StockMovementType.IN_SUPPLY:
      return 'Approvisionnement';
    case StockMovementType.OUT_SALE:
      return 'Vente';
    case StockMovementType.OUT_LOSS:
      return 'Perte';
    case StockMovementType.OUT_EXPIRED:
      return 'Peremption';
    case StockMovementType.IN_RETURN:
      return 'Retour client';
    case StockMovementType.ADJUSTMENT:
      return 'Ajustement';
  }
}

export const getStockMovementTypeColor = (type: StockMovementType): string => {
  if (type.startsWith('IN_'))
    return 'text-green-600 bg-green-50 border-green-100';
  if (type.startsWith('OUT_')) return 'text-red-600 bg-red-50 border-red-100';
  return 'text-blue-600 bg-blue-50 border-blue-100';
};
