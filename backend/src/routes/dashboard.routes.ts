import { Router } from 'express';
import { getDashboardMapData, getDashboardOverview } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/overview', protect, getDashboardOverview);
router.get('/map', protect, getDashboardMapData);

export default router;
