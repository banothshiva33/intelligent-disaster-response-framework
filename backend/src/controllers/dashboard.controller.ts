import type { Request, Response } from 'express';
import { Incident } from '../models/Incident';
import { Volunteer } from '../models/Volunteer';
import { Assignment } from '../models/Assignment';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const getDashboardOverview = async (_req: Request, res: Response) => {
  try {
    const [totalIncidents, verifiedIncidents, pendingIncidents, activeAssignments, availableVolunteers, busyVolunteers, recentIncidents] = await Promise.all([
      Incident.countDocuments(),
      Incident.countDocuments({ verificationStatus: 'VERIFIED' }),
      Incident.countDocuments({ verificationStatus: { $in: ['UNVERIFIED', 'PENDING_REVIEW'] } }),
      Assignment.countDocuments({ status: { $in: ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'IN_PROGRESS'] } }),
      Volunteer.countDocuments({ availability: 'AVAILABLE' }),
      Volunteer.countDocuments({ availability: 'BUSY' }),
      Incident.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    return sendSuccess(res, 200, 'Dashboard overview loaded.', {
      summary: {
        totalIncidents,
        verifiedIncidents,
        pendingIncidents,
        activeAssignments,
        availableVolunteers,
        busyVolunteers
      },
      recentIncidents: recentIncidents.map((incident) => ({
        id: incident._id,
        title: incident.title,
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
    return sendError(res, 500, 'Unable to load dashboard overview.', [(error as Error).message]);
  }
};

export const getDashboardMapData = async (_req: Request, res: Response) => {
  try {
    const [incidents, volunteers] = await Promise.all([
      Incident.find({ location: { $exists: true } }).select('title incidentType severity status verificationStatus location').lean(),
      Volunteer.find({ location: { $exists: true } }).populate('userId', 'name').lean()
    ]);

    const mapPoints = [
      ...incidents.map((incident) => ({
        type: 'incident',
        id: incident._id,
        title: incident.title,
        status: incident.status,
        verificationStatus: incident.verificationStatus,
        severity: incident.severity,
        coordinates: [incident.location.coordinates[0], incident.location.coordinates[1]]
      })),
      ...volunteers.map((volunteer) => ({
        type: 'volunteer',
        id: volunteer._id,
        title: volunteer.userId && typeof volunteer.userId === 'object' ? (volunteer.userId as any).name : 'Volunteer',
        status: volunteer.availability,
        verificationStatus: volunteer.verificationStatus,
        coordinates: volunteer.location ? [volunteer.location.coordinates[0], volunteer.location.coordinates[1]] : null
      })).filter((point) => point.coordinates)
    ];

    return sendSuccess(res, 200, 'Map data loaded.', {
      points: mapPoints
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to load GIS map data.', [(error as Error).message]);
  }
};
