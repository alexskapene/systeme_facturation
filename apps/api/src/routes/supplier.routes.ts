import { Router } from 'express';
import * as supplierCtrl from '../controllers/supplier.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Gestion des fournisseurs (B2B)
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Liste de tous les fournisseurs
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 *   post:
 *     summary: Créer un nouveau fournisseur
 *     tags: [Suppliers]
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
 *               - nif
 *               - address
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Congo Distribution Sarl"
 *               nif:
 *                 type: string
 *                 description: "Numéro d'Identification Fiscale (Obligatoire en RDC)"
 *                 example: "A1234567B"
 *               rccm:
 *                 type: string
 *                 example: "CD/KNG/RCCM/20-B-00123"
 *               address:
 *                 type: string
 *                 example: "12 Av. de l'Equateur, Gombe, Kinshasa"
 *               phone:
 *                 type: string
 *                 example: "+243810000000"
 *               email:
 *                 type: string
 *                 example: "contact@congodistrib.cd"
 *     responses:
 *       201:
 *         description: Fournisseur créé
 *       403:
 *         description: Seuls les Admins, Gestionnaires ou Comptables peuvent créer un fournisseur
 */
router
  .route('/')
  .get(supplierCtrl.getAllSuppliers)
  .post(
    authorize(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTIONNAIRE, Role.COMPTABLE),
    supplierCtrl.createSupplier,
  );

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Détails d'un fournisseur
 *     tags: [Suppliers]
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
 *       404:
 *         description: Fournisseur introuvable
 *   put:
 *     summary: Modifier un fournisseur
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Mis à jour avec succès
 */
router
  .route('/:id')
  .get(supplierCtrl.getSupplier)
  .put(
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.GESTIONNAIRE),
    supplierCtrl.updateSupplier,
  );

export default router;
