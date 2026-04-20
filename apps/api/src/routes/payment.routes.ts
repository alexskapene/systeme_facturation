import { Router } from 'express';
import * as paymentCtrl from '../controllers/payment.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Enregistrer un paiement ou un acompte pour une facture
 *     tags: [Payments]
 */
router.post(
  '/',
  authorize(Role.COMPTABLE, Role.ADMIN, Role.SUPER_ADMIN),
  paymentCtrl.addPayment,
);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Liste de tous les paiements enregistrés
 *     tags: [Payments]
 */
router.get('/', paymentCtrl.getPayments);

/**
 * @swagger
 * /payments/invoice/{invoiceId}:
 *   get:
 *     summary: Historique des paiements d'une facture
 *     tags: [Payments]
 */
router.get('/invoice/:invoiceId', paymentCtrl.getInvoicePayments);

export default router;
