import type { Request, Response } from 'express';
import { Volunteer } from '../models/Volunteer';
import { User } from '../models/User';
import { AuditRecord } from '../models/AuditRecord';
import { ApiError, sendError, sendSuccess } from '../utils/apiResponse';

export const getMyVolunteerProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const volunteer = await Volunteer.findOne({ userId: req.user.id }).lean();
    if (!volunteer) {
      return sendError(res, 404, 'Volunteer profile not found.', [{ field: 'volunteer', message: 'Create a volunteer profile first.' }]);
    }

    return sendSuccess(res, 200, 'Volunteer profile loaded.', {
      volunteer: {
        id: volunteer._id,
        userId: volunteer.userId,
        skills: volunteer.skills,
        availability: volunteer.availability,
        verificationStatus: volunteer.verificationStatus,
        experience: volunteer.experience,
        location: volunteer.location ? {
          latitude: volunteer.location.coordinates[1],
          longitude: volunteer.location.coordinates[0]
        } : null
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to load volunteer profile.', [(error as Error).message]);
  }
};

export const upsertMyVolunteerProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { skills, availability, experience, location } = req.body;

    let volunteer = await Volunteer.findOne({ userId: req.user.id });

if (!volunteer) {
  volunteer = new Volunteer({
    userId: req.user.id,
    skills: skills || [],
    availability: availability || 'AVAILABLE',
    verificationStatus: 'PENDING',
    experience: experience || 0,
    location: location ? {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    } : undefined
  });
} else {
      if (Array.isArray(skills)) volunteer.skills = skills;
      if (availability) volunteer.availability = availability;
      if (experience !== undefined) volunteer.experience = experience;
      if (location) {
        volunteer.location = {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        };
      }
    }

    await volunteer.save();

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'volunteer_profile_update',
      entityType: 'Volunteer',
      entityId: volunteer._id,
      metadata: { skills: volunteer.skills, availability: volunteer.availability }
    });

    return sendSuccess(res, 200, 'Volunteer profile saved.', {
      volunteer: {
        id: volunteer._id,
        userId: volunteer.userId,
        skills: volunteer.skills,
        availability: volunteer.availability,
        verificationStatus: volunteer.verificationStatus,
        experience: volunteer.experience,
        location: volunteer.location ? {
          latitude: volunteer.location.coordinates[1],
          longitude: volunteer.location.coordinates[0]
        } : null
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to save volunteer profile.', [(error as Error).message]);
  }
};

export const updateMyVolunteerAvailability = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { availability } = req.body;
    const volunteer = await Volunteer.findOne({ userId: req.user.id });

    if (!volunteer) {
      return sendError(res, 404, 'Volunteer profile not found.', [{ field: 'volunteer', message: 'Create a volunteer profile first.' }]);
    }

    volunteer.availability = availability;
    await volunteer.save();

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'volunteer_availability_update',
      entityType: 'Volunteer',
      entityId: volunteer._id,
      metadata: { availability }
    });

    return sendSuccess(res, 200, 'Volunteer availability updated.', {
      volunteer: {
        id: volunteer._id,
        availability: volunteer.availability
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to update volunteer availability.', [(error as Error).message]);
  }
};

export const updateMyVolunteerLocation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { latitude, longitude } = req.body;
    const volunteer = await Volunteer.findOne({ userId: req.user.id });

    if (!volunteer) {
      return sendError(res, 404, 'Volunteer profile not found.', [{ field: 'volunteer', message: 'Create a volunteer profile first.' }]);
    }

    volunteer.location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    await volunteer.save();

    return sendSuccess(res, 200, 'Volunteer location updated.', {
      volunteer: {
        id: volunteer._id,
        location: {
          latitude,
          longitude
        }
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to update volunteer location.', [(error as Error).message]);
  }
};

export const listVolunteers = async (_req: Request, res: Response) => {
  try {
    const volunteers = await Volunteer.find().populate('userId', 'name email').lean();

    return sendSuccess(res, 200, 'Volunteers loaded.', {
      volunteers: volunteers.map((volunteer) => ({
        id: volunteer._id,
        name: volunteer.userId && typeof volunteer.userId === 'object' ? (volunteer.userId as any).name : '',
        skills: volunteer.skills,
        status: volunteer.availability,
        verificationStatus: volunteer.verificationStatus,
        location: volunteer.location ? {
          latitude: volunteer.location.coordinates[1],
          longitude: volunteer.location.coordinates[0]
        } : null,
        experience: volunteer.experience
      }))
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to load volunteer roster.', [(error as Error).message]);
  }
};

export const getVolunteerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id).populate('userId', 'name email role').lean();

    if (!volunteer) {
      return sendError(res, 404, 'Volunteer not found.', [{ field: 'id', message: 'No volunteer exists with the provided id.' }]);
    }

    return sendSuccess(res, 200, 'Volunteer loaded.', {
      volunteer: {
        id: volunteer._id,
        name: volunteer.userId && typeof volunteer.userId === 'object' ? (volunteer.userId as any).name : '',
        skills: volunteer.skills,
        status: volunteer.availability,
        verificationStatus: volunteer.verificationStatus,
        location: volunteer.location ? {
          latitude: volunteer.location.coordinates[1],
          longitude: volunteer.location.coordinates[0]
        } : null,
        experience: volunteer.experience
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to fetch volunteer.', [(error as Error).message]);
  }
};
export const updateVolunteerVerification = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { id } = req.params;
    const { verificationStatus } = req.body;

    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return sendError(res, 404, 'Volunteer not found.', [
        {
          field: 'id',
          message: 'No volunteer exists with the provided id.'
        }
      ]);
    }

    volunteer.verificationStatus = verificationStatus;
    await volunteer.save();

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'volunteer_verification',
      entityType: 'Volunteer',
      entityId: volunteer._id,
      metadata: {
        verificationStatus
      }
    });

    return sendSuccess(res, 200, 'Volunteer verification status updated.', {
      volunteer: {
        id: volunteer._id,
        verificationStatus: volunteer.verificationStatus
      }
    });
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
      'Unable to update volunteer verification.',
      [(error as Error).message]
    );
  }
};
