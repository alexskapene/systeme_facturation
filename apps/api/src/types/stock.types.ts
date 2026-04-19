import { Document, Types } from 'mongoose';

export enum StockMovementType {
  IN_SUPPLY = 'IN_SUPPLY', // Approvisionnement (Entrée)
  OUT_SALE = 'OUT_SALE', // Vente (Sortie automatique)
  OUT_LOSS = 'OUT_LOSS', // Perte (Casse, vol)
  OUT_EXPIRED = 'OUT_EXPIRED', // Péremption
  IN_RETURN = 'IN_RETURN', // Retour client
  ADJUSTMENT = 'ADJUSTMENT', // Correction inventaire
}

export interface IStockMovement extends Document {
  product: Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  reason: string;
  performedBy: Types.ObjectId;
  supplier?: Types.ObjectId; // Si approvisionnement
  reference?: string; // N° de bon de livraison ou facture
  previousStock: number;
  newStock: number;
}
