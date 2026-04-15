import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as paymentService from '../services/payment.service';
import { Types } from 'mongoose';

export const addPayment = async (req: AuthRequest, res: Response) => {
  const payment = await paymentService.recordPayment(
    req.body,
    req.user?._id as Types.ObjectId,
  );
  res.status(201).json({
    success: true,
    message: 'Paiement/Acompte enregistré avec succès',
    data: payment,
  });
};

export const getInvoicePayments = async (req: AuthRequest, res: Response) => {
  const payments = await paymentService.getPaymentsByInvoice(
    req.params.invoiceId as string,
  );
  res.status(200).json({ success: true, data: payments });
};
