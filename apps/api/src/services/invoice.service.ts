import { Types } from 'mongoose';
import Invoice from '../models/Invoice';
import Product from '../models/Product';
import * as stockService from './stock.service';
import { IInvoice, InvoiceStatus } from '../types/invoice.types';
import { StockMovementType } from '../types/stock.types';
import { ProductCategory } from '../types/product.types';

/**
 * Générer un numéro de facture unique (Ex: FAC-2024-0001)
 */
const generateInvoiceNumber = async (): Promise<string> => {
  const count = await Invoice.countDocuments();
  const year = new Date().getFullYear();
  return `FAC-${year}-${(count + 1).toString().padStart(4, '0')}`;
};

export const createInvoice = async (
  invoiceData: IInvoice,
  userId: Types.ObjectId,
) => {
  let totalHT = 0;
  let totalTVA = 0;
  const processedItems = [];

  // Boucler sur les items pour vérifier le stock et calculer les prix
  for (const item of invoiceData.items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Produit ${item.product} non trouvé`);
    if (!product.active)
      throw new Error(`Le produit ${product.name} n'est plus en vente`);

    // Vérifier le stock uniquement pour les ARTICLES
    if (product.category === ProductCategory.ARTICLE) {
      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `Stock insuffisant pour ${product.name} (Dispo: ${product.stockQuantity})`,
        );
      }
    }

    const unitHT = product.priceHT;
    const lineHT = unitHT * item.quantity;
    const lineTVA = lineHT * 0.16; // TVA 16% RDC
    const lineTTC = lineHT + lineTVA;

    totalHT += lineHT;
    totalTVA += lineTVA;

    processedItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      unitPriceHT: unitHT,
      tvaAmount: lineTVA,
      totalPriceTTC: lineTTC,
    });

    // Déduire du stock uniquement pour les ARTICLES via un mouvement de type OUT_SALE
    if (product.category === ProductCategory.ARTICLE) {
      await stockService.addStockMovement({
        product: product._id as Types.ObjectId,
        type: StockMovementType.OUT_SALE,
        quantity: item.quantity,
        reason: `Vente Facture en cours de génération`,
        performedBy: userId,
      });
    }
  }

  // Créer la facture finale
  const invoiceNumber = await generateInvoiceNumber();
  const invoice = await Invoice.create({
    invoiceNumber,
    client: invoiceData.client,
    items: processedItems,
    totalHT,
    totalTVA,
    totalTTC: totalHT + totalTVA,
    amountPaid: 0,
    remainingAmount: totalHT + totalTVA,
    createdBy: userId,
    status: InvoiceStatus.PENDING, // Par défaut PENDING tant qu'il n'y a oas de paiement
  });

  return invoice.populate('client createdBy');
};

export const getAllInvoices = async () => {
  return await Invoice.find()
    .populate('client', 'name email')
    .populate('createdBy', 'name firstName');
};

export const getInvoiceById = async (id: string) => {
  const invoice = await Invoice.findById(id).populate(
    'client items.product createdBy',
  );
  if (!invoice) throw new Error('Facture introuvable');
  return invoice;
};
