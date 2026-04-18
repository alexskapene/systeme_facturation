import { Router } from 'express';
import * as dashboardCtrl from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/stats', dashboardCtrl.getStats);

export default router;
