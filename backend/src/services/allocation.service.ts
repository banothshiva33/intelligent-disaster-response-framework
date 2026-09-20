import { Incident } from '../models/Incident';
import { Volunteer } from '../models/Volunteer';

import {
  haversineDistanceKm,
  normalizeDistanceScore
} from './geospatial.service';

export const SKILL_WEIGHT = 0.50;
export const DISTANCE_WEIGHT = 0.30;
export const AVAILABILITY_WEIGHT = 0.20;

export const MAX_DISTANCE_KM = 50;

const toNormalisedArray = (values: string[]) =>
  values
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

export interface VolunteerRankingEntry {
  volunteerId:string;
  name: string;
  skills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  skillScore: number;
  distanceKm: number | null;
  distanceScore: number;
  availabilityScore: number;
  priorityScore: number;
  availability: string;
}

export const rankEligibleVolunteers = async (
  incident: InstanceType<typeof Incident>,
  excludedVolunteerIds: string[] = []
): Promise<VolunteerRankingEntry[]> => {
  const requiredSkills = toNormalisedArray(
    incident.requiredSkills || []
  );

  const excludedIds = new Set(
    excludedVolunteerIds.map((id) => id.toString())
  );

  const volunteers = await Volunteer.find({
    availability: 'AVAILABLE',
    verificationStatus: 'VERIFIED'
  })
    .populate('userId', 'name email')
    .lean();

  const rankedVolunteers = volunteers
    .filter(
      (volunteer) =>
        !excludedIds.has(volunteer._id.toString())
    )
    .map((volunteer) => {
      const volunteerSkills = toNormalisedArray(
        (volunteer.skills || []) as string[]
      );

      const matchedRequiredSkills =
        requiredSkills.filter(
          (skill) => volunteerSkills.includes(skill)
        );

      const skillScore =
        requiredSkills.length > 0
          ? matchedRequiredSkills.length /
            requiredSkills.length
          : 0;

      const distanceKm =
        volunteer.location && incident.location
          ? haversineDistanceKm(
              incident.location.coordinates[1],
              incident.location.coordinates[0],
              volunteer.location.coordinates[1],
              volunteer.location.coordinates[0]
            )
          : Number.POSITIVE_INFINITY;

      const distanceScore =
        Number.isFinite(distanceKm)
          ? normalizeDistanceScore(
              distanceKm,
              MAX_DISTANCE_KM
            )
          : 0;

      // Availability is currently an eligibility gate.
      // Every volunteer reaching this stage is AVAILABLE.
      const availabilityScore = 1;

      const priorityScore =
        (SKILL_WEIGHT * skillScore) +
        (DISTANCE_WEIGHT * distanceScore) +
        (AVAILABILITY_WEIGHT * availabilityScore);

      const missingSkills =
        requiredSkills.filter(
          (skill) =>
            !matchedRequiredSkills.includes(skill)
        );

      const volunteerUser =
        volunteer.userId &&
        typeof volunteer.userId === 'object'
          ? (volunteer.userId as { name?: string })
          : null;

      return {
        volunteerId: volunteer._id.toString(),

        name: volunteerUser?.name ?? '',

        skills: volunteer.skills,

        matchedSkills: matchedRequiredSkills,

        missingSkills,

        skillScore: Number(
          skillScore.toFixed(6)
        ),

        distanceKm: Number.isFinite(distanceKm)
          ? Number(distanceKm.toFixed(2))
          : null,

        distanceScore,

        availabilityScore,

        priorityScore: Number(
          priorityScore.toFixed(6)
        ),

        availability: volunteer.availability
      };
    })
    .filter((entry) => {
      if (requiredSkills.length === 0) {
        return true;
      }

      // Current RAAVA operational rule:
      // at least one required skill must match.
      return entry.matchedSkills.length > 0;
    })
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }

      if (
        (a.distanceKm ?? Number.POSITIVE_INFINITY) !==
        (b.distanceKm ?? Number.POSITIVE_INFINITY)
      ) {
        return (
          (a.distanceKm ?? Number.POSITIVE_INFINITY) -
          (b.distanceKm ?? Number.POSITIVE_INFINITY)
        );
      }

      return a.volunteerId
        .toString()
        .localeCompare(
          b.volunteerId.toString()
        );
    });

  return rankedVolunteers;
};