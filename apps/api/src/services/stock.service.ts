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
