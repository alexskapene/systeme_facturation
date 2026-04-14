import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '../types/user.types';

const router = Router();

// Toutes les routes ci-dessous nécessitent d'être connecté
router.use(protect);

// Seul le SUPER_ADMIN et l'ADMIN peuvent gérer les utilisateurs
router.use(authorize(Role.SUPER_ADMIN, Role.ADMIN));

router.route('/').get(userController.getUsers).post(userController.createUser);

router.route('/:id').get(userController.getUser).put(userController.updateUser);

// Route pour activer/désactiver un compte
router.patch('/:id/toggle-status', userController.toggleStatus);

export default router;
