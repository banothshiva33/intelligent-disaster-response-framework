import type { Request, Response } from 'express';

import { Assignment } from '../models/Assignment';
import { Incident } from '../models/Incident';
import { Volunteer } from '../models/Volunteer';
import { AuditRecord } from '../models/AuditRecord';
import {
  rankEligibleVolunteers
} from '../services/allocation.service';
import { sendNotification } from '../services/notification.service';

import {
  ApiError,
  sendError,
  sendSuccess
} from '../utils/apiResponse';

export const createAssignment = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const {
      incidentId,
      volunteerId,
      message
    } = req.body;

    // --------------------------------------------------
    // 1. Find incident
    // --------------------------------------------------

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return sendError(
        res,
        404,
        'Incident not found.',
        [
          {
            field: 'incidentId',
            message: 'No incident exists for this id.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 2. Assignment is allowed only for verified incidents
    // --------------------------------------------------

    if (incident.verificationStatus !== 'VERIFIED') {
      return sendError(
        res,
        422,
        'Only verified incidents can receive assignments.',
        [
          {
            field: 'verificationStatus',
            message:
              'The incident must be verified before volunteer assignment.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 3. Find volunteer
    // --------------------------------------------------

    const volunteer = await Volunteer.findById(volunteerId);

    if (!volunteer) {
      return sendError(
        res,
        404,
        'Volunteer not found.',
        [
          {
            field: 'volunteerId',
            message:
              'No volunteer profile exists for this id.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 4. Volunteer must be verified
    // --------------------------------------------------

    if (volunteer.verificationStatus !== 'VERIFIED') {
      return sendError(
        res,
        409,
        'Volunteer is not verified.',
        [
          {
            field: 'volunteerId',
            message:
              'Only verified volunteers can receive assignments.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 5. Volunteer must be available
    // --------------------------------------------------

    if (volunteer.availability !== 'AVAILABLE') {
      return sendError(
        res,
        409,
        'Volunteer is not available for assignment.',
        [
          {
            field: 'volunteerId',
            message:
              'The selected volunteer is currently unavailable.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 6. Prevent multiple active assignments
    // --------------------------------------------------

    const existingAssignment =
      await Assignment.findOne({
        volunteerId,
        status: {
          $in: [
            'PENDING',
            'ACCEPTED',
            'EN_ROUTE',
            'IN_PROGRESS'
          ]
        }
      });

    if (existingAssignment) {
      return sendError(
        res,
        409,
        'Volunteer already has an active assignment.',
        [
          {
            field: 'volunteerId',
            message:
              'The selected volunteer already has an active assignment.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 7. Prevent duplicate assignment for this incident
    // --------------------------------------------------

    const existingIncidentAssignment =
      await Assignment.findOne({
        incidentId,
        volunteerId,
        status: {
          $in: [
            'PENDING',
            'ACCEPTED',
            'EN_ROUTE',
            'IN_PROGRESS'
          ]
        }
      });

    if (existingIncidentAssignment) {
      return sendError(
        res,
        409,
        'Assignment already exists for this volunteer and incident.',
        [
          {
            field: 'volunteerId',
            message:
              'This volunteer already has an active assignment for this incident.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 8. Create assignment
    // --------------------------------------------------

    const assignment = await Assignment.create({
      incidentId,
      volunteerId,
      assignedBy: req.user.id,
      status: 'PENDING',
      message:
        message || 'New volunteer assignment request.'
    });

    // --------------------------------------------------
    // 9. Update incident status
    // --------------------------------------------------

    incident.status = 'ASSIGNMENT_PENDING';
    incident.verificationStatus = 'VERIFIED';

    await incident.save();

    // --------------------------------------------------
    // 10. Reserve volunteer
    //
    // The volunteer becomes BUSY while the assignment
    // is awaiting acknowledgement.
    // --------------------------------------------------

    volunteer.availability = 'BUSY';
    volunteer.currentAssignmentId = assignment._id;

    await volunteer.save();

    // --------------------------------------------------
    // 11. Audit assignment creation
    // --------------------------------------------------

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'assignment_created',
      entityType: 'Assignment',
      entityId: assignment._id,
      metadata: {
        incidentId,
        volunteerId,
        status: assignment.status,
        message: assignment.message
      }
    });

    // --------------------------------------------------
    // 12. Notify volunteer
    // --------------------------------------------------

    await sendNotification({
      userId: volunteer.userId.toString(),
      title: 'New emergency assignment',
      message:
        `You have been assigned to incident "${incident.title}". Please confirm your availability.`,
      type: 'ASSIGNMENT',
      metadata: {
        incidentId: incident._id.toString(),
        assignmentId: assignment._id.toString(),
        severity: incident.severity,
        location: incident.location.address
      }
    });

    // --------------------------------------------------
    // 13. Return assignment
    // --------------------------------------------------

    return sendSuccess(
      res,
      201,
      'Volunteer assignment created and sent for acknowledgment.',
      {
        assignment: {
          id: assignment._id,
          incidentId: assignment.incidentId,
          volunteerId: assignment.volunteerId,
          assignedBy: assignment.assignedBy,
          status: assignment.status,
          message: assignment.message,
          createdAt: assignment.createdAt
        },
        incident: {
          id: incident._id,
          status: incident.status,
          verificationStatus:
            incident.verificationStatus
        }
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
      'Unable to create assignment.',
      [(error as Error).message]
    );
  }
};

// ======================================================
// LIST ASSIGNMENTS FOR AN INCIDENT
// ======================================================

export const listAssignmentsForIncident = async (
  req: Request,
  res: Response
) => {
  try {
    const { incidentId } = req.params;

    const assignments =
      await Assignment.find({ incidentId })
        .populate(
          'volunteerId',
          'skills availability verificationStatus currentAssignmentId'
        )
        .populate({
          path: 'volunteerId',
          populate: {
            path: 'userId',
            select: 'name email'
          }
        })
        .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      200,
      'Assignments loaded.',
      {
        assignments: assignments.map(
          (assignment) => ({
            id: assignment._id,
            incidentId: assignment.incidentId,
            volunteerId: assignment.volunteerId,
            assignedBy: assignment.assignedBy,
            status: assignment.status,
            message: assignment.message,
            createdAt: assignment.createdAt,
            acceptedAt: assignment.acceptedAt,
            declinedAt: assignment.declinedAt
          })
        )
      }
    );
  } catch (error) {
    return sendError(
      res,
      500,
      'Unable to load assignments.',
      [(error as Error).message]
    );
  }
};

// ======================================================
// GET MY ASSIGNMENTS
// ======================================================

export const getMyAssignments = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new ApiError(
        401,
        'Authentication required.'
      );
    }

    const volunteer =
      await Volunteer.findOne({
        userId: req.user.id
      });

    if (!volunteer) {
      return sendError(
        res,
        404,
        'Volunteer profile not found.',
        [
          {
            field: 'user',
            message:
              'No volunteer profile exists for this user.'
          }
        ]
      );
    }

    const assignments =
      await Assignment.find({
        volunteerId: volunteer._id
      })
        .sort({ createdAt: -1 })
        .lean();

    return sendSuccess(
      res,
      200,
      'Your assignments loaded.',
      {
        assignments: assignments.map(
          (assignment) => ({
            id: assignment._id,
            incidentId: assignment.incidentId,
            volunteerId: assignment.volunteerId,
            status: assignment.status,
            message: assignment.message,
            createdAt: assignment.createdAt,
            acceptedAt: assignment.acceptedAt,
            declinedAt: assignment.declinedAt
          })
        )
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
      'Unable to load your assignments.',
      [(error as Error).message]
    );
  }
};

// ======================================================
// RESPOND TO ASSIGNMENT
// ======================================================

export const respondToAssignment = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new ApiError(
        401,
        'Authentication required.'
      );
    }

    const { assignmentId } = req.params;
    const { status, message } = req.body;

    // --------------------------------------------------
    // 1. Find assignment
    // --------------------------------------------------

    const assignment =
      await Assignment.findById(assignmentId);

    if (!assignment) {
      return sendError(
        res,
        404,
        'Assignment not found.',
        [
          {
            field: 'assignmentId',
            message:
              'No assignment exists for the provided id.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 2. Find volunteer
    // --------------------------------------------------

    const volunteer =
      await Volunteer.findById(
        assignment.volunteerId
      );

    if (!volunteer) {
      return sendError(
        res,
        404,
        'Volunteer not found.',
        [
          {
            field: 'volunteerId',
            message:
              'The assignment references a missing volunteer profile.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 3. Ensure requesting user owns volunteer profile
    // --------------------------------------------------

    if (
      volunteer.userId.toString() !==
      req.user.id
    ) {
      return sendError(
        res,
        403,
        'Forbidden.',
        [
          'You are not the assigned volunteer for this assignment.'
        ]
      );
    }

    // --------------------------------------------------
    // 4. Validate response status
    // --------------------------------------------------

    if (
      !['ACCEPTED', 'DECLINED'].includes(status)
    ) {
      return sendError(
        res,
        422,
        'Invalid assignment response.',
        [
          {
            field: 'status',
            message:
              'Use ACCEPTED or DECLINED.'
          }
        ]
      );
    }

    // --------------------------------------------------
    // 5. Assignment must still be pending
    // --------------------------------------------------

    if (assignment.status !== 'PENDING') {
      return sendError(
        res,
        409,
        'Assignment can no longer be responded to.',
        [
          {
            field: 'status',
            message:
              'Only pending assignments can be accepted or declined.'
          }
        ]
      );
    }

    assignment.status = status;

    if (message) {
      assignment.message = message;
    }
// --------------------------------------------------
// 6. Accepted assignment
// --------------------------------------------------

if (status === 'ACCEPTED') {
  assignment.acceptedAt = new Date();

  volunteer.availability = 'BUSY';
  volunteer.currentAssignmentId =
    assignment._id;

  const incident =
    await Incident.findById(
      assignment.incidentId
    );

  if (incident) {
    incident.status = 'IN_PROGRESS';
    await incident.save();
  }
}

// --------------------------------------------------
// 7. Declined assignment
// --------------------------------------------------

// --------------------------------------------------
// 7. Declined assignment + automatic reassignment
// --------------------------------------------------

if (status === 'DECLINED') {
  assignment.declinedAt = new Date();

  // Release the current volunteer
  volunteer.availability = 'AVAILABLE';
  volunteer.currentAssignmentId = undefined;

  // Save the declined assignment first
  await assignment.save();
  await volunteer.save();

  // ------------------------------------------------
  // Find volunteers who already declined this incident
  // ------------------------------------------------

  const previousDeclinedAssignments =
    await Assignment.find({
      incidentId: assignment.incidentId,
      status: 'DECLINED'
    })
      .select('volunteerId')
      .lean();

  const excludedVolunteerIds =
    previousDeclinedAssignments.map(
      (item) => item.volunteerId.toString()
    );

  // ------------------------------------------------
  // Find incident
  // ------------------------------------------------

  const incident = await Incident.findById(
    assignment.incidentId
  );

  if (!incident) {
    throw new ApiError(
      404,
      'Incident not found during reassignment.'
    );
  }

  // ------------------------------------------------
  // Use the same RAAVA ranking engine
  // ------------------------------------------------

  const rankedVolunteers =
    await rankEligibleVolunteers(
      incident,
      excludedVolunteerIds
    );

  const nextVolunteer =
    rankedVolunteers[0];

  // ------------------------------------------------
  // No replacement volunteer available
  // ------------------------------------------------

  if (!nextVolunteer) {
    incident.status = 'VERIFIED';
    incident.verificationStatus = 'VERIFIED';

    await incident.save();

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'assignment_reassignment_failed',
      entityType: 'Incident',
      entityId: incident._id,
      metadata: {
        declinedAssignmentId:
          assignment._id.toString(),

        reason:
          'No eligible volunteer remained.',

        excludedVolunteerIds
      }
    });

    return sendSuccess(
      res,
      200,
      'Assignment declined. No eligible replacement volunteer is currently available.',
      {
        assignment: {
          id: assignment._id,
          incidentId: assignment.incidentId,
          volunteerId: assignment.volunteerId,
          status: assignment.status,
          message: assignment.message,
          acceptedAt: assignment.acceptedAt,
          declinedAt: assignment.declinedAt
        },

        reassignment: {
          created: false,
          reason:
            'No eligible volunteer remained.'
        }
      }
    );
  }

  // ------------------------------------------------
  // Find replacement volunteer
  // ------------------------------------------------

  const replacementVolunteer =
    await Volunteer.findById(
      nextVolunteer.volunteerId
    );

  if (!replacementVolunteer) {
    throw new ApiError(
      404,
      'Replacement volunteer not found.'
    );
  }

  // ------------------------------------------------
  // Create replacement assignment
  // ------------------------------------------------

  const replacementAssignment =
    await Assignment.create({
      incidentId: incident._id,
      volunteerId:
        replacementVolunteer._id,
      assignedBy: req.user.id,
      status: 'PENDING',
      message:
        'Replacement volunteer assignment request.'
    });

  // ------------------------------------------------
  // Reserve replacement volunteer
  // ------------------------------------------------

  replacementVolunteer.availability =
    'BUSY';

  replacementVolunteer.currentAssignmentId =
    replacementAssignment._id;

  await replacementVolunteer.save();

  // ------------------------------------------------
  // Update incident
  // ------------------------------------------------

  incident.status =
    'ASSIGNMENT_PENDING';

  incident.verificationStatus =
    'VERIFIED';

  await incident.save();

  // ------------------------------------------------
  // Audit reassignment
  // ------------------------------------------------

  await AuditRecord.create({
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'assignment_reassigned',
    entityType: 'Assignment',
    entityId: replacementAssignment._id,
    metadata: {
      incidentId:
        incident._id.toString(),

      previousAssignmentId:
        assignment._id.toString(),

      declinedVolunteerId:
        volunteer._id.toString(),

      replacementVolunteerId:
        replacementVolunteer._id.toString(),

      replacementPriorityScore:
        nextVolunteer.priorityScore,

      replacementSkillScore:
        nextVolunteer.skillScore,

      replacementDistanceKm:
        nextVolunteer.distanceKm,

      replacementDistanceScore:
        nextVolunteer.distanceScore,

      scoringWeights: {
        skill: 0.50,
        distance: 0.30,
        availability: 0.20
      }
    }
  });

  // ------------------------------------------------
  // Notify replacement volunteer
  // ------------------------------------------------

  await sendNotification({
    userId:
      replacementVolunteer.userId.toString(),

    title:
      'New emergency assignment',

    message:
      `You have been assigned to incident "${incident.title}". Please confirm your availability.`,

    type: 'ASSIGNMENT',

    metadata: {
      incidentId:
        incident._id.toString(),

      assignmentId:
        replacementAssignment._id.toString(),

      severity:
        incident.severity,

      location:
        incident.location.address,

      reassigned: true
    }
  });

  // ------------------------------------------------
  // Return reassignment result
  // ------------------------------------------------

  return sendSuccess(
    res,
    200,
    'Assignment declined and reassigned to the next eligible volunteer.',
    {
      assignment: {
        id: assignment._id,
        incidentId: assignment.incidentId,
        volunteerId: assignment.volunteerId,
        status: assignment.status,
        message: assignment.message,
        acceptedAt: assignment.acceptedAt,
        declinedAt: assignment.declinedAt
      },

      reassignment: {
        created: true,

        assignment: {
          id: replacementAssignment._id,
          incidentId:
            replacementAssignment.incidentId,
          volunteerId:
            replacementAssignment.volunteerId,
          status:
            replacementAssignment.status,
          message:
            replacementAssignment.message,
          createdAt:
            replacementAssignment.createdAt
        },

        ranking: {
          priorityScore:
            nextVolunteer.priorityScore,

          skillScore:
            nextVolunteer.skillScore,

          distanceKm:
            nextVolunteer.distanceKm,

          distanceScore:
            nextVolunteer.distanceScore,

          matchedSkills:
            nextVolunteer.matchedSkills,

          missingSkills:
            nextVolunteer.missingSkills
        }
      }
    }
  );
}

    // --------------------------------------------------
    // 8. Audit response
    // --------------------------------------------------

    await AuditRecord.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: 'assignment_response',
      entityType: 'Assignment',
      entityId: assignment._id,
      metadata: {
        status,
        message: assignment.message
      }
    });

    return sendSuccess(
      res,
      200,
      status === 'ACCEPTED'
        ? 'Assignment accepted.'
        : 'Assignment declined.',
      {
        assignment: {
          id: assignment._id,
          incidentId: assignment.incidentId,
          volunteerId: assignment.volunteerId,
          status: assignment.status,
          message: assignment.message,
          acceptedAt: assignment.acceptedAt,
          declinedAt: assignment.declinedAt
        }
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
      'Unable to update assignment.',
      [(error as Error).message]
    );
  }
};