import { Types } from 'mongoose';
import Product from '../models/Product';
import { IProduct } from '../types/product.types';
import { StockMovementType } from '../types/stock.types';
import * as stockService from './stock.service';

/**
 * Créer un produit avec gestion optionnelle du stock initial
 */
export const createProduct = async (
  productData: Partial<IProduct>,
  userId: string | Types.ObjectId,
) => {
  // Calcul de la TVA conforme RDC
  if (productData.priceHT) {
    productData.priceTTC = Math.round(productData.priceHT * 1.16 * 100) / 100;
  }

  // Extraction de la quantité initiale (on met à 0 dans l'objet de création pour forcer le passage par le mouvement de stock)
  const initialQty = productData.stockQuantity || 0;

  // Création du produit
  const product = await Product.create({
    ...productData,
    stockQuantity: 0, // Initialisé à 0, sera mis à jour par le mouvement si nécessaire
    createdBy: userId,
  });

  // Si un stock initial est fourni, on crée un mouvement d'approvisionnement
  if (initialQty > 0) {
    await stockService.addStockMovement({
      product: product._id as Types.ObjectId,
      type: StockMovementType.IN_SUPPLY,
      quantity: initialQty,
      reason: 'Stock initial à la création du produit',
      performedBy: userId as Types.ObjectId,
      previousStock: 0,
      newStock: initialQty,
    });

    // Mise à jour de la quantité réelle sur le produit
    product.stockQuantity = initialQty;
    await product.save();
  }

  return product;
};

export const getAllProducts = async () => {
  return await Product.find()
    .populate('supplier', 'name nif')
    .populate('createdBy', 'name firstName');
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id).populate('supplier createdBy');
  if (!product) throw new Error('Produit introuvable');
  return product;
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  if (data.priceHT) {
    data.priceTTC = Math.round(data.priceHT * 1.16 * 100) / 100;
  }
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new Error('Produit introuvable');
  return product;
};

export const toggleProductStatus = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Produit introuvable');
  product.active = !product.active;
  return await product.save();
};
