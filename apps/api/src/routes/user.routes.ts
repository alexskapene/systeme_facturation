import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (Réservé aux Admins)
 */

// Toutes les routes ci-dessous nécessitent d'être connecté
router.use(protect);

// Seul le SUPER_ADMIN et l'ADMIN peuvent gérer les utilisateurs
router.use(authorize(Role.SUPER_ADMIN, Role.ADMIN));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (Rôle insuffisant)
 *
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
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
 *               - firstName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               firstName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [SUPER_ADMIN, ADMIN, COMPTABLE, GESTIONNAIRE, AGENT_VENTE]
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
router.route('/').get(userController.getUsers).post(userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtenir les détails d'un utilisateur par son ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               firstName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [SUPER_ADMIN, ADMIN, COMPTABLE, GESTIONNAIRE, AGENT_VENTE]
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */
router.route('/:id').get(userController.getUser).put(userController.updateUser);

/**
 * @swagger
 * /users/{id}/toggle-status:
 *   patch:
 *     summary: Activer ou désactiver un compte utilisateur
 *     description: Permet de bloquer l'accès à un employé sans supprimer ses données (intégrité fiscale).
 *     tags: [Users]
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
 *         description: Statut du compte modifié avec succès
 */
router.patch('/:id/toggle-status', userController.toggleStatus);

export default router;
