import { Router } from 'express';

import {
  getMyVolunteerProfile,
  getVolunteerById,
  listVolunteers,
  updateMyVolunteerAvailability,
  updateMyVolunteerLocation,
  upsertMyVolunteerProfile,
  updateVolunteerVerification
} from '../controllers/volunteer.controller';

import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';

import {
  volunteerAvailabilitySchema,
  volunteerLocationSchema,
  volunteerProfileSchema,
  volunteerVerificationSchema
} from '../validators/volunteer.validator';

const router = Router();

// Get current user's volunteer profile
router.get(
  '/me',
  protect,
  getMyVolunteerProfile
);

// Create or update current user's volunteer profile
router.patch(
  '/me',
  protect,
  validate(volunteerProfileSchema),
  upsertMyVolunteerProfile
);

// Update current user's availability
router.patch(
  '/me/availability',
  protect,
  validate(volunteerAvailabilitySchema),
  updateMyVolunteerAvailability
);

// Update current user's location
router.patch(
  '/me/location',
  protect,
  validate(volunteerLocationSchema),
  updateMyVolunteerLocation
);

// List volunteers
router.get(
  '/',
  protect,
  listVolunteers
);

// Get volunteer by ID
router.get(
  '/:id',
  protect,
  getVolunteerById
);

// Coordinator/Admin: verify or reject a volunteer
router.patch(
  '/:id/verification',
  protect,
  authorize('COORDINATOR', 'ADMIN'),
  validate(volunteerVerificationSchema),
  updateVolunteerVerification
);

export default router;