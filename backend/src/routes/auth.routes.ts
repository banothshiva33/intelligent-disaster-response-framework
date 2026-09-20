import { Router } from 'express';
import { login, me, register, updateProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, profileSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);
router.patch('/profile', protect, validate(profileSchema), updateProfile);

export default router;
