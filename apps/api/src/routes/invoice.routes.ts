import { Router } from 'express';
import * as invoiceCtrl from '../controllers/invoice.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Gestion des factures électroniques et conformité fiscale (DGI)
 */

// --- PROTECTION GLOBALE ---
// Toutes les opérations sur les factures nécessitent d'être authentifié
router.use(protect);

// ==========================================
// ROUTES DE BASE (/api/v1/invoices)
// ==========================================

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Liste de toutes les factures
 *     description: Récupère l'historique complet des factures. Les relations (Client, Vendeur) sont peuplées.
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès - Retourne un tableau de factures.
 *       401:
 *         description: Token manquant ou invalide.
 *   post:
 *     summary: Générer une nouvelle facture (Vente)
 *     description: |
 *       Cette route effectue plusieurs opérations critiques :
 *       1. Vérifie la disponibilité du stock pour chaque produit.
 *       2. Calcule automatiquement la TVA (16%) et les totaux (HT/TTC).
 *       3. Déduit les quantités du stock (Mouvement OUT_SALE).
 *       4. Génère un numéro de facture unique (Ex: FAC-2024-0001).
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client, items]
 *             properties:
 *               client:
 *                 type: string
 *                 description: ID du client (récupéré depuis le module Clients)
 *                 example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *               items:
 *                 type: array
 *                 description: Liste des produits et quantités
 *                 items:
 *                   type: object
 *                   required: [product, quantity]
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7a8b9c0d2"
 *                     quantity:
 *                       type: number
 *                       example: 5
 *     responses:
 *       201:
 *         description: Facture générée avec succès.
 *       400:
 *         description: Stock insuffisant ou données invalides.
 *       403:
 *         description: Seuls les Agents de vente, Comptables et Admins peuvent facturer.
 */
router
  .route('/')
  .get(invoiceCtrl.getInvoices) // Tout le personnel peut consulter l'historique
  .post(
    // Autorise les profils qui traitent avec les clients
    authorize(Role.AGENT_VENTE, Role.COMPTABLE, Role.ADMIN, Role.SUPER_ADMIN),
    invoiceCtrl.createInvoice,
  );

// ==========================================
// ROUTES SPÉCIFIQUES PAR ID (/api/v1/invoices/:id)
// ==========================================

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Consulter les détails d'une facture spécifique
 *     description: Récupère le détail complet d'une facture, y compris la liste des produits vendus.
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de la facture (MongoDB _id)
 *     responses:
 *       200:
 *         description: Détails de la facture récupérés.
 *       404:
 *         description: Facture introuvable.
 */
router.route('/:id').get(invoiceCtrl.getInvoice);

export default router;
