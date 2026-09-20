import type { Request, Response } from 'express';
import { Incident } from '../models/Incident';
import { Evidence } from '../models/Evidence';
import { AuditRecord } from '../models/AuditRecord';
import { sendSuccess, sendError, ApiError } from '../utils/apiResponse';

export const createIncident = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { title, description, incidentType, severity, requiredSkills, location, evidence } = req.body;

    if (!evidence || !Array.isArray(evidence) || evidence.length === 0) {
      return sendError(res, 422, 'At least one evidence file is required.', [{ field: 'evidence', message: 'Evidence is mandatory.' }]);
    }

    const incident = await Incident.create({
      reporterId: req.user.id,
      incidentType,
      title,
      description,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address
      },
      severity: severity || 'Medium',
      requiredSkills: requiredSkills || [],
      evidenceIds: [],
      status: 'PENDING_EVIDENCE',
      verificationStatus: 'UNVERIFIED'
    });

    const evidenceDocs = await Promise.all(
      evidence.map((file: any) =>
        Evidence.create({
          incidentId: incident._id,
          uploadedBy: req.user!.id,
          fileName: file.fileName,
          filePath: file.filePath,
          mimeType: file.mimeType,
          fileSize: file.fileSize,
          validationStatus: 'PENDING',
          metadata: { source: 'upload' }
        })
      )
    );

    incident.evidenceIds = evidenceDocs.map((doc) => doc._id);
    incident.status = 'EVIDENCE_VALIDATED';
    incident.verificationStatus = 'UNVERIFIED';
    await incident.save();

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'incident_creation',
      entityType: 'Incident',
      entityId: incident._id,
      metadata: {
        incidentType,
        title,
        status: incident.status,
        evidenceCount: evidenceDocs.length
      }
    });

    return sendSuccess(res, 201, 'Incident created successfully and moved into verification workflow.', {
      incident: {
        id: incident._id,
        title: incident.title,
        description: incident.description,
        type: incident.incidentType,
        severity: incident.severity,
        status: incident.status,
        verificationStatus: incident.verificationStatus,
        location: {
          latitude: incident.location.coordinates[1],
          longitude: incident.location.coordinates[0],
          address: incident.location.address
        },
        createdAt: incident.createdAt
      },
      evidence: evidenceDocs.map((doc) => ({
        id: doc._id,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
        validationStatus: doc.validationStatus
      }))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to create incident.', [(error as Error).message]);
  }
};

export const listIncidents = async (_req: Request, res: Response) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 }).lean();

    return sendSuccess(res, 200, 'Incidents loaded.', {
      incidents: incidents.map((incident) => ({
        id: incident._id,
        title: incident.title,
        description: incident.description,
        type: incident.incidentType,
        severity: incident.severity,
        status: incident.status,
        verificationStatus: incident.verificationStatus,
        location: {
          latitude: incident.location.coordinates[1],
          longitude: incident.location.coordinates[0],
          address: incident.location.address
        },
        createdAt: incident.createdAt
      }))
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to load incidents.', [(error as Error).message]);
  }
};

export const getIncidentById = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const incident = await Incident.findById(incidentId).lean();

    if (!incident) {
      return sendError(res, 404, 'Incident not found.', [{ field: 'incidentId', message: 'No incident found with the provided id.' }]);
    }

    return sendSuccess(res, 200, 'Incident loaded.', {
      incident: {
        id: incident._id,
        title: incident.title,
        description: incident.description,
        type: incident.incidentType,
        severity: incident.severity,
        status: incident.status,
        verificationStatus: incident.verificationStatus,
        location: {
          latitude: incident.location.coordinates[1],
          longitude: incident.location.coordinates[0],
          address: incident.location.address
        },
        createdAt: incident.createdAt
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to load incident.', [(error as Error).message]);
  }
};
