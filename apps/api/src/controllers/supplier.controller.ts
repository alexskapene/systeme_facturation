import { Request, Response } from 'express';
import * as supplierService from '../services/supplier.service';
import { AuthRequest } from '../middlewares/auth.middleware';

// Note: createSupplier est utilisé dans le service, mais on peut aussi l'exposer via une route POST /suppliers
export const createSupplier = async (req: AuthRequest, res: Response) => {
  const data = { ...req.body, createdBy: req.user?._id };
  const supplier = await supplierService.createSupplier(data);
  res.status(201).json({ success: true, data: supplier });
};

// Note: getAllSuppliers est utilisé dans le service, mais on peut aussi l'exposer via une route GET /suppliers
export const getAllSuppliers = async (_req: Request, res: Response) => {
  const suppliers = await supplierService.getAllSuppliers();
  res.status(200).json({ success: true, data: suppliers });
};

// Note: getSupplierById est utilisé dans le service, mais on peut aussi l'exposer via une route GET /suppliers/:id
export const getSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = await supplierService.getSupplierById(id as string);
  res.status(200).json({ success: true, data: supplier });
};

// Note: updateSupplier est utilisé dans le service, mais on peut aussi l'exposer via une route PUT /suppliers/:id
export const updateSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = await supplierService.updateSupplier(id as string, req.body);
  res
    .status(200)
    .json({ success: true, message: 'Fournisseur mis à jour', data: supplier });
};
