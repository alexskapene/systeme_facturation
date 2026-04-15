import { Router } from 'express';
import * as clientCtrl from '../controllers/client.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion de la clientèle (Personnes physiques et morales)
 */

// --- MIDDLEWARES GLOBAUX DU MODULE ---
// Toutes les routes définies dans ce fichier nécessitent une authentification valide
router.use(protect);

// ==========================================
// ROUTES DE BASE (/api/v1/clients)
// ==========================================

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Liste de tous les clients
 *     description: Récupère tous les clients. Accessible par tout utilisateur connecté.
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès.
 *   post:
 *     summary: Créer un nouveau client
 *     description: Enregistre un nouveau client. Le NIF est recommandé pour les entreprises.
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, address]
 *             properties:
 *               name: { type: string, example: "Entreprise Alpha SARL" }
 *               clientType: { type: string, enum: [PERSONNE_PHYSIQUE, PERSONNE_MORALE] }
 *               nif: { type: string, example: "A2201234P" }
 *               rccm: { type: string, example: "CD/KNG/RCCM/24-B-001" }
 *               email: { type: string, example: "info@alpha.cd" }
 *               phone: { type: string, example: "+243812345678" }
 *               address: { type: string, example: "Gombe, Kinshasa" }
 *     responses:
 *       201:
 *         description: Client créé avec succès.
 *       403:
 *         description: Permission insuffisante.
 */
router
  .route('/')
  .get(clientCtrl.getClients) // Consultable par tout le personnel
  .post(
    // La création est ouverte aux profils opérationnels (Ventes, Comptabilité) et Admins
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.AGENT_VENTE, Role.COMPTABLE),
    clientCtrl.createClient,
  );

// ==========================================
// ROUTES SPÉCIFIQUES PAR ID (/api/v1/clients/:id)
// ==========================================

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Détails d'un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du client
 *     responses:
 *       200:
 *         description: Détails du client avec les infos du créateur.
 *   put:
 *     summary: Modifier les informations d'un client
 *     tags: [Clients]
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
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client mis à jour.
 *   delete:
 *     summary: Suppression définitive (SUPER_ADMIN uniquement)
 *     description: Supprime physiquement le client de la base de données.
 *     tags: [Clients]
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
 *         description: Client supprimé.
 */
router
  .route('/:id')
  .get(clientCtrl.getClient)
  .put(
    // La modification est une action de gestion (Admins et Gestionnaires uniquement)
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.GESTIONNAIRE),
    clientCtrl.updateClient,
  )
  .delete(
    // Action critique : Seul le Super Admin peut supprimer physiquement une donnée
    authorize(Role.SUPER_ADMIN),
    clientCtrl.deleteClient,
  );

// ==========================================
// ACTIONS SPÉCIALES
// ==========================================

/**
 * @swagger
 * /clients/{id}/toggle-status:
 *   patch:
 *     summary: Activer ou désactiver un client
 *     description: Alternative à la suppression pour conserver l'historique des factures.
 *     tags: [Clients]
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
 *         description: Statut basculé avec succès.
 */
router.patch(
  '/:id/toggle-status',
  // Gestion de l'état du compte réservée à l'administration
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  clientCtrl.toggleStatus,
);

export default router;
