import Product from '../models/Product';
import StockMovement from '../models/StockMovement';
import { IStockMovement, StockMovementType } from '../types/stock.types';

export const addStockMovement = async (data: Partial<IStockMovement>) => {
  const product = await Product.findById(data.product);
  if (!product) throw new Error('Produit introuvable');

  const previousStock = product.stockQuantity;
  let newStock = previousStock;

  // Déterminer si on ajoute ou on soustrait
  const isEntry = [
    StockMovementType.IN_SUPPLY,
    StockMovementType.IN_RETURN,
  ].includes(data.type as StockMovementType);

  if (isEntry) {
    newStock += data.quantity!;
  } else {
    if (previousStock < data.quantity!) {
      throw new Error(`Stock insuffisant. Stock actuel: ${previousStock}`);
    }
    newStock -= data.quantity!;
  }

  // Enregistrer le mouvement
  const movement = await StockMovement.create({
    ...data,
    previousStock,
    newStock,
  });

  // Mettre à jour la quantité dans le produit
  product.stockQuantity = newStock;
  await product.save();

  return movement;
};

export const getMovementsByProduct = async (productId: string) => {
  return await StockMovement.find({ product: productId })
    .populate('performedBy', 'name firstName')
    .sort({ createdAt: -1 });
};

/**
 * Modifier un mouvement existant (Correction d'erreur)
 */
export const updateMovement = async (
  movementId: string,
  updateData: { quantity: number; reason?: string },
) => {
  const oldMovement = await StockMovement.findById(movementId);
  if (!oldMovement) throw new Error('Mouvement introuvable');

  const product = await Product.findById(oldMovement.product);
  if (!product) throw new Error('Produit lié introuvable');

  const isEntry = [
    StockMovementType.IN_SUPPLY,
    StockMovementType.IN_RETURN,
  ].includes(oldMovement.type as StockMovementType);

  // Calcul de la différence de quantité
  const diff = updateData.quantity - oldMovement.quantity;

  // Ajustement du stock du produit
  if (isEntry) {
    product.stockQuantity += diff;
  } else {
    product.stockQuantity -= diff;
  }

  if (product.stockQuantity < 0)
    throw new Error('La modification entraînerait un stock négatif');

  // Mise à jour du mouvement
  oldMovement.quantity = updateData.quantity;
  if (updateData.reason) oldMovement.reason = updateData.reason;
  oldMovement.newStock =
    oldMovement.previousStock +
    (isEntry ? updateData.quantity : -updateData.quantity);

  await oldMovement.save();
  await product.save();

  return oldMovement;
};
