import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';

const router = Router();

// Route de santé (Health Check) pour le test de connectivité
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'eTax Solution RDC API - Operational 🚀',
    timestamp: new Date().toISOString(),
  });
});

// Documentation
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Modules applicatifs
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
