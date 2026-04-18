import { Router, Request, Response } from 'express';
import { swaggerSpec } from '../config/swagger';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import swaggerUi from 'swagger-ui-express';
import supplierRoutes from './supplier.routes';
import productRoutes from './product.routes';
import stockRoutes from './stock.routes';
import paymentRoutes from './payment.routes';
import clientRoutes from './client.route';
import invoiceRoutes from './invoice.routes';
import dashboardRoutes from './dashboard.routes';

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
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/stock', stockRoutes);
router.use('/stocks', stockRoutes); // alias plural pour compatibilité
router.use('/payments', paymentRoutes);
router.use('/clients', clientRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
