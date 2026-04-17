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
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  performedBy: string;
  performedByName: string;
  reference?: string;
  previousStock: number;
  newStock: number;
  createdAt: string;
}

export const stockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Produit A',
    type: StockMovementType.IN_SUPPLY,
    quantity: 100,
    reason: 'Approvisionnement initial',
    performedBy: '1',
    performedByName: 'John Doe',
    reference: 'BL-2024-001',
    previousStock: 50,
    newStock: 150,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    productId: '1',
    productName: 'Produit A',
    type: StockMovementType.OUT_SALE,
    quantity: 5,
    reason: 'Vente facture FAC-2024-0001',
    performedBy: '2',
    performedByName: 'Marie Martin',
    reference: 'FAC-2024-0001',
    previousStock: 150,
    newStock: 145,
    createdAt: '2024-01-11',
  },
  {
    id: '3',
    productId: '2',
    productName: 'Produit B',
    type: StockMovementType.IN_SUPPLY,
    quantity: 50,
    reason: 'Reapprovisionnement',
    performedBy: '1',
    performedByName: 'John Doe',
    reference: 'BL-2024-002',
    previousStock: 40,
    newStock: 90,
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    productId: '3',
    productName: 'Produit C',
    type: StockMovementType.OUT_LOSS,
    quantity: 5,
    reason: 'Casse lors du transport',
    performedBy: '3',
    performedByName: 'Pierre Dupont',
    previousStock: 65,
    newStock: 60,
    createdAt: '2024-01-15',
  },
  {
    id: '5',
    productId: '2',
    productName: 'Produit B',
    type: StockMovementType.OUT_SALE,
    quantity: 3,
    reason: 'Vente facture FAC-2024-0001',
    performedBy: '2',
    performedByName: 'Marie Martin',
    reference: 'FAC-2024-0001',
    previousStock: 90,
    newStock: 87,
    createdAt: '2024-01-11',
  },
  {
    id: '6',
    productId: '1',
    productName: 'Produit A',
    type: StockMovementType.IN_RETURN,
    quantity: 2,
    reason: 'Retour client - produit defectueux',
    performedBy: '2',
    performedByName: 'Marie Martin',
    reference: 'RET-2024-001',
    previousStock: 145,
    newStock: 147,
    createdAt: '2024-01-18',
  },
  {
    id: '7',
    productId: '3',
    productName: 'Produit C',
    type: StockMovementType.OUT_EXPIRED,
    quantity: 3,
    reason: 'Produits perimes',
    performedBy: '3',
    performedByName: 'Pierre Dupont',
    previousStock: 60,
    newStock: 57,
    createdAt: '2024-01-20',
  },
  {
    id: '8',
    productId: '1',
    productName: 'Produit A',
    type: StockMovementType.ADJUSTMENT,
    quantity: 3,
    reason: 'Correction apres inventaire',
    performedBy: '1',
    performedByName: 'John Doe',
    previousStock: 147,
    newStock: 150,
    createdAt: '2024-01-25',
  },
];

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

export function getStockMovementTypeColor(type: StockMovementType): string {
  switch (type) {
    case StockMovementType.IN_SUPPLY:
      return 'bg-green-500 text-white';
    case StockMovementType.OUT_SALE:
      return 'bg-blue-500 text-white';
    case StockMovementType.OUT_LOSS:
      return 'bg-red-500 text-white';
    case StockMovementType.OUT_EXPIRED:
      return 'bg-orange-500 text-white';
    case StockMovementType.IN_RETURN:
      return 'bg-cyan-500 text-white';
    case StockMovementType.ADJUSTMENT:
      return 'bg-purple-500 text-white';
  }
}

export function isStockIn(type: StockMovementType): boolean {
  return (
    type === StockMovementType.IN_SUPPLY ||
    type === StockMovementType.IN_RETURN ||
    type === StockMovementType.ADJUSTMENT
  );
}
