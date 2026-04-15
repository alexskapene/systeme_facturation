import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as productService from '../services/product.service';
import { Types } from 'mongoose';

export const createProduct = async (req: AuthRequest, res: Response) => {
  // On récupère l'ID de l'utilisateur depuis le middleware de protection
  const userId = req.user?._id;

  if (!userId) {
    res.status(401);
    throw new Error('Utilisateur non authentifié');
  }

  const product = await productService.createProduct(
    req.body,
    userId as Types.ObjectId,
  );
  res.status(201).json({ success: true, data: product });
};

export const getAllProducts = async (_req: AuthRequest, res: Response) => {
  const products = await productService.getAllProducts();
  res.status(200).json({ success: true, data: products });
};

export const getProduct = async (req: AuthRequest, res: Response) => {
  const product = await productService.getProductById(req.params.id as string);
  res.status(200).json({ success: true, data: product });
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const product = await productService.updateProduct(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ success: true, data: product });
};

export const toggleStatus = async (req: AuthRequest, res: Response) => {
  const product = await productService.toggleProductStatus(
    req.params.id as string,
  );
  res
    .status(200)
    .json({ success: true, message: 'Status mis à jour', data: product });
};
