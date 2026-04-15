import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as invoiceService from '../services/invoice.service';
import { Types } from 'mongoose';

export const createInvoice = async (req: AuthRequest, res: Response) => {
  const invoice = await invoiceService.createInvoice(
    req.body,
    req.user?._id as Types.ObjectId,
  );
  res
    .status(201)
    .json({
      success: true,
      message: 'Facture générée avec succès',
      data: invoice,
    });
};

export const getInvoices = async (_req: AuthRequest, res: Response) => {
  const invoices = await invoiceService.getAllInvoices();
  res.status(200).json({ success: true, data: invoices });
};

export const getInvoice = async (req: AuthRequest, res: Response) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id as string);
  res.status(200).json({ success: true, data: invoice });
};
