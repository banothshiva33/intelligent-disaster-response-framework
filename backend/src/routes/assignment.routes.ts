import { Router } from 'express';

import {
  createAssignment,
  getMyAssignments,
  listAssignmentsForIncident,
  respondToAssignment
} from '../controllers/assignment.controller';

import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';

import {
  assignmentResponseSchema,
  createAssignmentSchema
} from '../validators/assignment.validator';

const router = Router();

// Coordinator/Admin creates an assignment
router.post(
  '/',
  protect,
  authorize('COORDINATOR', 'ADMIN'),
  validate(createAssignmentSchema),
  createAssignment
);

// Volunteer retrieves their own assignments
router.get(
  '/me',
  protect,
  getMyAssignments
);

// Coordinator/Admin views assignments for an incident
router.get(
  '/incident/:incidentId',
  protect,
  authorize('COORDINATOR', 'ADMIN'),
  listAssignmentsForIncident
);

// Assigned volunteer accepts/declines an assignment
router.patch(
  '/:assignmentId/response',
  protect,
  validate(assignmentResponseSchema),
  respondToAssignment
);

export default router;