import { Types } from 'mongoose';
import Payment from '../models/Payment';
import Invoice from '../models/Invoice';
import { IPayment } from '../types/payment.types';
import { InvoiceStatus } from '../types/invoice.types';

export const recordPayment = async (
  paymentData: Partial<IPayment>,
  userId: Types.ObjectId,
) => {
  const invoice = await Invoice.findById(paymentData.invoice);
  if (!invoice) throw new Error('Facture introuvable');

  if (invoice.status === InvoiceStatus.PAID) {
    throw new Error('Cette facture est déjà entièrement payée');
  }

  if (paymentData.amount! > invoice.remainingAmount) {
    throw new Error(
      `Le montant dépasse le reste à payer (${invoice.remainingAmount} USD/CDF)`,
    );
  }

  // Enregistrer le paiement
  const payment = await Payment.create({
    ...paymentData,
    recordedBy: userId,
  });

  // Mettre à jour la facture
  invoice.amountPaid += payment.amount;
  invoice.remainingAmount -= payment.amount;

  // Si tout est payé, on change le statut
  if (invoice.remainingAmount <= 0) {
    invoice.status = InvoiceStatus.PAID;
  }

  await invoice.save();

  return payment;
};

export const getPaymentsByInvoice = async (invoiceId: string) => {
  return await Payment.find({ invoice: invoiceId }).populate(
    'recordedBy',
    'name firstName',
  );
};
