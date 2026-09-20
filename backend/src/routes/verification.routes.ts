import { Router } from 'express';
import { addConfirmation, decideVerification, requestCoordinatorReview } from '../controllers/verification.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { confirmationSchema, coordinatorDecisionSchema, reviewRequestSchema } from '../validators/verification.validator';

const router = Router();

router.post('/confirm', protect, validate(confirmationSchema), addConfirmation);
router.post('/:incidentId/request-review', protect, authorize('COORDINATOR', 'ADMIN'), validate(reviewRequestSchema), requestCoordinatorReview);
router.post('/:incidentId/decision', protect, authorize('COORDINATOR', 'ADMIN'), validate(coordinatorDecisionSchema), decideVerification);

export default router;
