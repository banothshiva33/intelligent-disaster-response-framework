import { Router } from 'express';

import { seedDemo } from '../controllers/seed.controller';

const router = Router();

router.post('/', seedDemo);

export default router;