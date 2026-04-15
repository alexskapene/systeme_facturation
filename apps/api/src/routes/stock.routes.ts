import { Router } from 'express';
import * as stockCtrl from '../controllers/stock.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /stock:
 *   post:
 *     summary: Enregistrer un mouvement de stock (Entrée/Sortie/Perte)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product, type, quantity, reason]
 *             properties:
 *               product: { type: string, example: "ID_PRODUIT" }
 *               type: { type: string, enum: [IN_SUPPLY, OUT_LOSS, OUT_EXPIRED, ADJUSTMENT] }
 *               quantity: { type: number, example: 50 }
 *               reason: { type: string, example: "Nouvel arrivage fournisseur" }
 *               reference: { type: string, example: "BL-2024-001" }
 */
router.post(
  '/',
  authorize(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTIONNAIRE),
  stockCtrl.createMovement,
);

/**
 * @swagger
 * /stock/{productId}:
 *   get:
 *     summary: Historique des mouvements d'un produit
 *     tags: [Stock]
 */
router.get('/:productId', stockCtrl.getHistory);

/**
 * @swagger
 * /stock/{id}:
 *   put:
 *     summary: Modifier un mouvement de stock (Recalcule automatiquement le stock du produit)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  stockCtrl.updateMovement,
);

export default router;
