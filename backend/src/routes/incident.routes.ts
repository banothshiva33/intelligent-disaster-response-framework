import { Router } from 'express';

import {
  createIncident,
  getIncidentById,
  listIncidents
} from '../controllers/incident.controller';

import { protect } from '../middleware/auth.middleware';

import {
  validate,
  validateParams
} from '../middleware/validation.middleware';

import {
  createIncidentSchema,
  incidentIdParamSchema
} from '../validators/incident.validator';

const router = Router();

// List incidents
router.get(
  '/',
  protect,
  listIncidents
);

// Get a single incident
router.get(
  '/:incidentId',
  protect,
  validateParams(incidentIdParamSchema),
  getIncidentById
);

// Create incident
router.post(
  '/',
  protect,
  validate(createIncidentSchema),
  createIncident
);

export default router;