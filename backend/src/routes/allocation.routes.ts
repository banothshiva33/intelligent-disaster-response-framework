import { Router } from 'express';
import { getVolunteerRanking } from '../controllers/allocation.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
const router = Router();

router.get(
  '/:incidentId/volunteers',
  protect,
  authorize('COORDINATOR', 'ADMIN'),
  getVolunteerRanking
);

export default router;
