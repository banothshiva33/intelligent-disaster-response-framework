import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Evidence } from '../models/Evidence';
import { Incident } from '../models/Incident';
import { AuditRecord } from '../models/AuditRecord';
import { sendSuccess, sendError, ApiError } from '../utils/apiResponse';
import { env } from '../config/env';

export const uploadEvidence = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return sendError(res, 422, 'Evidence upload is required.', [{ field: 'file', message: 'No files were uploaded.' }]);
    }

    const { incidentId } = req.params;
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return sendError(res, 404, 'Incident not found.', [{ field: 'incidentId', message: 'No incident with that ID exists.' }]);
    }

    const evidenceRecords = await Promise.all(
      files.map(async (file) => {
        const record = await Evidence.create({
          incidentId: incident._id,
          uploadedBy: req.user!.id,
          fileName: file.originalname,
          filePath: path.join(env.UPLOAD_DIR, file.filename),
          mimeType: file.mimetype,
          fileSize: file.size,
          validationStatus: 'PENDING'
        });

        incident.evidenceIds.push(record._id);
        return record;
      })
    );

    await incident.save();

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'evidence_upload',
      entityType: 'Evidence',
      entityId: incident._id,
      metadata: { evidenceIds: evidenceRecords.map((record) => record._id) }
    });

    return sendSuccess(res, 201, 'Evidence uploaded successfully.', {
      evidence: evidenceRecords.map((record) => ({
        id: record._id,
        fileName: record.fileName,
        mimeType: record.mimeType,
        validationStatus: record.validationStatus,
        filePath: record.filePath
      }))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Evidence upload failed.', [(error as Error).message]);
  }
};

export const validateEvidence = async (req: Request, res: Response) => {
  try {
    const { evidenceId } = req.params;
    const { validationStatus } = req.body;

    const evidence = await Evidence.findById(evidenceId);
    if (!evidence) {
      return sendError(res, 404, 'Evidence not found.', [{ field: 'evidenceId', message: 'No evidence with this ID exists.' }]);
    }

    if (!['VALID', 'REJECTED'].includes(validationStatus)) {
      return sendError(res, 422, 'Invalid validation status.', [{ field: 'validationStatus', message: 'Use VALID or REJECTED.' }]);
    }

    evidence.validationStatus = validationStatus;
    await evidence.save();

    await AuditRecord.create({
      actorId: req.user?.id,
      actorRole: req.user?.role,
      action: 'evidence_validation',
      entityType: 'Evidence',
      entityId: evidence._id,
      metadata: { validationStatus }
    });

    return sendSuccess(res, 200, 'Evidence validation updated.', {
      evidence: {
        id: evidence._id,
        validationStatus: evidence.validationStatus
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to validate evidence.', [(error as Error).message]);
  }
};

export const getEvidenceByIncident = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const evidence = await Evidence.find({ incidentId }).sort({ uploadedAt: -1 });

    return sendSuccess(res, 200, 'Evidence loaded.', {
      evidence: evidence.map((item) => ({
        id: item._id,
        fileName: item.fileName,
        mimeType: item.mimeType,
        fileSize: item.fileSize,
        validationStatus: item.validationStatus,
        filePath: item.filePath,
        uploadedAt: item.uploadedAt
      }))
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to fetch incident evidence.', [(error as Error).message]);
  }
};

export const removeEvidence = async (req: Request, res: Response) => {
  try {
    const { evidenceId } = req.params;
    const record = await Evidence.findById(evidenceId);

    if (!record) {
      return sendError(res, 404, 'Evidence not found.', [{ field: 'evidenceId', message: 'No evidence matched this ID.' }]);
    }

    const absolutePath = path.resolve(process.cwd(), record.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await record.deleteOne();

    return sendSuccess(res, 200, 'Evidence removed.', { evidenceId });
  } catch (error) {
    return sendError(res, 500, 'Unable to remove evidence.', [(error as Error).message]);
  }
};
