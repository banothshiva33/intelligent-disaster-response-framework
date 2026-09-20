import type { Request, Response } from 'express';

import { Incident } from '../models/Incident';
import { AuditRecord } from '../models/AuditRecord';

import {
  rankEligibleVolunteers,
  SKILL_WEIGHT,
  DISTANCE_WEIGHT,
  AVAILABILITY_WEIGHT,
  MAX_DISTANCE_KM
} from '../services/allocation.service';

import {
  ApiError,
  sendError,
  sendSuccess
} from '../utils/apiResponse';

export const getVolunteerRanking = async (
  req: Request,
  res: Response
) => {
  try {
    const { incidentId } = req.params;

    // --------------------------------------------------
    // 1. Find incident
    // --------------------------------------------------

    const incident = await Incident.findById(
      incidentId
    );

    if (!incident) {
      return sendError(
        res,
        404,
        'Incident not found.',
        [
          {
            field: 'incidentId',
            message:
              'No incident exists for this id.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 2. Only verified incidents can enter allocation
    // --------------------------------------------------

    if (
      incident.verificationStatus !== 'VERIFIED'
    ) {
      return sendError(
        res,
        422,
        'Only verified incidents can be allocated.',
        [
          {
            field: 'verificationStatus',
            message:
              'Volunteer allocation requires a verified incident.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 3. Generate RAAVA ranking
    // --------------------------------------------------

    const requiredSkills =
      incident.requiredSkills || [];

    const rankedVolunteers =
      await rankEligibleVolunteers(incident);

    // --------------------------------------------------
    // 4. Record allocation-ranking audit
    // --------------------------------------------------

    await AuditRecord.create({
      actorId: req.user?.id,
      actorRole: req.user?.role,
      action: 'allocation_ranking',
      entityType: 'Incident',
      entityId: incident._id,
      metadata: {
        totalCandidates:
          rankedVolunteers.length,

        requiredSkills,

        incidentStatus:
          incident.status,

        scoringWeights: {
          skill: SKILL_WEIGHT,
          distance: DISTANCE_WEIGHT,
          availability:
            AVAILABILITY_WEIGHT
        },

        maxDistanceKm:
          MAX_DISTANCE_KM
      }
    });

    // --------------------------------------------------
    // 5. Return ranking
    // --------------------------------------------------

    return sendSuccess(
      res,
      200,
      'Volunteer ranking generated.',
      {
        incidentId,
        requiredSkills,
        volunteers: rankedVolunteers
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(
        res,
        error.statusCode,
        error.message,
        error.details ?? []
      );
    }

    return sendError(
      res,
      500,
      'Unable to generate volunteer ranking.',
      [(error as Error).message]
    );
  }
};