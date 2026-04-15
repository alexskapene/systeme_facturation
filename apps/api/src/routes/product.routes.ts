import { Router } from 'express';
import * as productCtrl from '../controllers/product.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Catalogue des produits et services
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Liste des produits (Catalogue)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 *   post:
 *     summary: Ajouter un produit au catalogue
 *     description: Le prix TTC est calculé automatiquement (HT * 1.16)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - priceHT
 *               - supplier
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sac de Ciment 50kg"
 *               description:
 *                 type: string
 *                 example: "Ciment gris de haute qualité"
 *               priceHT:
 *                 type: number
 *                 description: "Prix Hors Taxe"
 *                 example: 12.5
 *               stockQuantity:
 *                 type: number
 *                 example: 100
 *               supplier:
 *                 type: string
 *                 description: "ID de l'objet Fournisseur"
 *                 example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès
 */
router
  .route('/')
  .get(productCtrl.getAllProducts)
  .post(
    authorize(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTIONNAIRE, Role.COMPTABLE),
    productCtrl.createProduct,
  );

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Détails d'un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 *   put:
 *     summary: Modifier un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit modifié
 */
router
  .route('/:id')
  .get(productCtrl.getProduct)
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.GESTIONNAIRE),
    productCtrl.updateProduct,
  );

/**
 * @swagger
 * /products/{id}/toggle-status:
 *   patch:
 *     summary: Activer/Désactiver un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut modifié
 */
router.patch(
  '/:id/toggle-status',
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  productCtrl.toggleStatus,
);

export default router;
