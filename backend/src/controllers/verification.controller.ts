import type { Request, Response } from 'express';
import { Incident } from '../models/Incident';
import { Confirmation } from '../models/Confirmation';
import { VerificationRecord } from '../models/VerificationRecord';
import { AuditRecord } from '../models/AuditRecord';
import { sendNotification } from '../services/notification.service';
import { ApiError, sendError, sendSuccess } from '../utils/apiResponse';

export const addConfirmation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { incidentId, sourceType, response, comment, location } = req.body;
    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return sendError(res, 404, 'Incident not found.', [{ field: 'incidentId', message: 'No incident exists for this id.' }]);
    }

    if (incident.reporterId.toString() === req.user.id) {
      return sendError(res, 403, 'Reporter cannot confirm their own incident.', ['A citizen cannot validate their own report.']);
    }

    const existingConfirmation = await Confirmation.findOne({ incidentId, confirmingUserId: req.user.id });
    if (existingConfirmation) {
      return sendError(res, 409, 'Duplicate confirmation.', [{ field: 'incidentId', message: 'This user has already submitted a confirmation for this incident.' }]);
    }

    const confirmation = await Confirmation.create({
      incidentId,
      confirmingUserId: req.user.id,
      sourceType,
      response,
      comment,
      locationAtConfirmation: location
        ? {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          }
        : undefined
    });

    const positiveConfirmation = response === 'CONFIRMED';

    if (positiveConfirmation) {
      incident.verificationStatus = 'VERIFIED';
      incident.status = 'VERIFIED';
      incident.verifiedAt = new Date();
      incident.verificationMethod = 'CONFIRMATION';
      await incident.save();
    }

    await VerificationRecord.create({
      incidentId,
      sourceType,
      confirmingUserId: req.user.id,
      decision: positiveConfirmation ? 'VERIFIED' : 'PENDING',
      notes: comment ?? 'Confirmation submitted.'
    });

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'confirmation',
      entityType: 'Confirmation',
      entityId: confirmation._id,
      metadata: {
        incidentId,
        sourceType,
        response,
        positiveConfirmation
      }
    });

    return sendSuccess(res, 201, positiveConfirmation ? 'Incident verified by valid confirmation.' : 'Confirmation recorded.', {
      confirmation: {
        id: confirmation._id,
        incidentId,
        sourceType,
        response,
        comment,
        createdAt: confirmation.createdAt
      },
      incident: {
        id: incident._id,
        status: incident.status,
        verificationStatus: incident.verificationStatus
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to record confirmation.', [(error as Error).message]);
  }
};

export const requestCoordinatorReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { incidentId } = req.params;
    const { notes, verificationCallRequested, callStatus } = req.body;

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return sendError(res, 404, 'Incident not found.', [{ field: 'incidentId', message: 'No incident exists for this id.' }]);
    }

    incident.status = 'COORDINATOR_REVIEW';
    incident.verificationStatus = 'PENDING_REVIEW';
    incident.verificationMethod = 'COORDINATOR_REVIEW';
    await incident.save();

    const record = await VerificationRecord.create({
      incidentId,
      sourceType: 'COORDINATOR',
      coordinatorId: req.user.id,
      decision: 'PENDING',
      notes: notes || 'Coordinator review requested.',
      verificationCallRequested: Boolean(verificationCallRequested),
      callStatus: callStatus || 'MANUAL'
    });

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'coordinator_review',
      entityType: 'Incident',
      entityId: incident._id,
      metadata: {
        verificationCallRequested: Boolean(verificationCallRequested),
        callStatus: callStatus || 'MANUAL',
        notes: notes || 'Coordinator review requested.'
      }
    });

    await sendNotification({
      userId: incident.reporterId.toString(),
      title: 'Incident review requested',
      message: 'Your incident has been escalated to coordinator review for verification.',
      type: 'VERIFICATION',
      metadata: {
        incidentId: incident._id.toString(),
        status: incident.status
      }
    });

    return sendSuccess(res, 200, 'Incident moved to coordinator review.', {
      incident: {
        id: incident._id,
        status: incident.status,
        verificationStatus: incident.verificationStatus
      },
      review: {
        id: record._id,
        callStatus: record.callStatus,
        verificationCallRequested: record.verificationCallRequested
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to request coordinator review.', [(error as Error).message]);
  }
};

export const decideVerification = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { incidentId } = req.params;
    const { decision, notes, verificationCallRequested, callStatus } = req.body;

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return sendError(res, 404, 'Incident not found.', [{ field: 'incidentId', message: 'No incident exists for this id.' }]);
    }

    if (!['VERIFIED', 'FALSE_REPORT'].includes(decision)) {
      return sendError(res, 422, 'Invalid decision.', [{ field: 'decision', message: 'Use VERIFIED or FALSE_REPORT.' }]);
    }

    const finalDecision = decision === 'VERIFIED' ? 'VERIFIED' : 'FALSE_REPORT';

    incident.status = finalDecision === 'VERIFIED' ? 'VERIFIED' : 'FALSE_REPORT';
    incident.verificationStatus = finalDecision === 'VERIFIED' ? 'VERIFIED' : 'FALSE_REPORT';
    incident.verificationMethod = 'COORDINATOR_REVIEW';

    if (finalDecision === 'VERIFIED') {
      incident.verifiedAt = new Date();
    }

    await incident.save();

    const record = await VerificationRecord.create({
      incidentId,
      sourceType: 'COORDINATOR',
      coordinatorId: req.user.id,
      decision: finalDecision,
      notes: notes || 'Coordinator decision recorded.',
      verificationCallRequested: Boolean(verificationCallRequested),
      callStatus: callStatus || 'MANUAL'
    });

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: finalDecision === 'VERIFIED' ? 'verification_decision' : 'false_report_decision',
      entityType: 'Incident',
      entityId: incident._id,
      metadata: {
        decision: finalDecision,
        notes: notes || 'Coordinator decision recorded.',
        verificationCallRequested: Boolean(verificationCallRequested),
        callStatus: callStatus || 'MANUAL'
      }
    });

    return sendSuccess(res, 200, finalDecision === 'VERIFIED' ? 'Incident verified by coordinator.' : 'Incident marked as false report.', {
      incident: {
        id: incident._id,
        status: incident.status,
        verificationStatus: incident.verificationStatus
      },
      verification: {
        id: record._id,
        decision: finalDecision,
        notes: notes || 'Coordinator decision recorded.'
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to process coordinator verification.', [(error as Error).message]);
  }
};
