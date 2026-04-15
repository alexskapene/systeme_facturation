import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as stockService from '../services/stock.service';

export const createMovement = async (req: AuthRequest, res: Response) => {
  const movementData = {
    ...req.body,
    performedBy: req.user?._id,
  };
  const movement = await stockService.addStockMovement(movementData);
  res.status(201).json({ success: true, data: movement });
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  const history = await stockService.getMovementsByProduct(
    req.params.productId as string,
  );
  res.status(200).json({ success: true, data: history });
};

export const updateMovement = async (req: AuthRequest, res: Response) => {
  const movement = await stockService.updateMovement(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({
    success: true,
    message: 'Mouvement corrigé et stock produit synchronisé',
    data: movement,
  });
};
