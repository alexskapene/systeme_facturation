import Supplier from '../models/Supplier';
import { ISupplier } from '../types/supplier.types';

export const createSupplier = async (data: Partial<ISupplier>) => {
  return await Supplier.create(data);
};

export const getAllSuppliers = async () => {
  return await Supplier.find().populate('createdBy', 'name firstName');
};

export const getSupplierById = async (id: string) => {
  const supplier = await Supplier.findById(id).populate(
    'createdBy',
    'name firstName',
  );
  if (!supplier) throw new Error('Fournisseur introuvable');
  return supplier;
};

export const updateSupplier = async (id: string, data: Partial<ISupplier>) => {
  const supplier = await Supplier.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!supplier) throw new Error('Fournisseur introuvable');
  return supplier;
};

export const deleteSupplier = async (id: string) => {
  const supplier = await Supplier.findByIdAndDelete(id);
  if (!supplier) throw new Error('Fournisseur introuvable');
  return supplier;
};
