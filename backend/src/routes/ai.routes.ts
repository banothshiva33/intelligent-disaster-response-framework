import { Router } from 'express';
import { predictSeverity } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/predict-severity', protect, predictSeverity);

export default router;
