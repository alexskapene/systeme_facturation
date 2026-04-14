import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie le token JWT
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', authController.login);

export default router;
