import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Volunteer } from '../models/Volunteer';
import { Incident } from '../models/Incident';

export const seedDemoData = async () => {
  const passwordHash = await bcrypt.hash('raava123', 10);

  // ---------------------------------------------------------
  // 1. Coordinator
  // ---------------------------------------------------------
  let coordinator = await User.findOne({
    email: 'coordinator@raava.local'
  });

  if (!coordinator) {
    coordinator = await User.create({
      name: 'Operations Coordinator',
      email: 'coordinator@raava.local',
      passwordHash,
      role: 'COORDINATOR',
      trustScore: 100,
      isActive: true
    });
  }

  // ---------------------------------------------------------
  // 2. Volunteer One
  // ---------------------------------------------------------
  let volunteerOne = await User.findOne({
    email: 'aisha@raava.local'
  });

  if (!volunteerOne) {
    volunteerOne = await User.create({
      name: 'Aisha Khan',
      email: 'aisha@raava.local',
      passwordHash,
      role: 'VOLUNTEER',
      trustScore: 90,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [78.4870, 17.3850]
      }
    });
  }

  // ---------------------------------------------------------
  // 3. Volunteer Two
  // ---------------------------------------------------------
  let volunteerTwo = await User.findOne({
    email: 'mohan@raava.local'
  });

  if (!volunteerTwo) {
    volunteerTwo = await User.create({
      name: 'Mohan Reddy',
      email: 'mohan@raava.local',
      passwordHash,
      role: 'VOLUNTEER',
      trustScore: 82,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [78.4297, 17.3997]
      }
    });
  }

  // ---------------------------------------------------------
  // 4. Citizen
  // ---------------------------------------------------------
  let citizen = await User.findOne({
    email: 'priya@raava.local'
  });

  if (!citizen) {
    citizen = await User.create({
      name: 'Priya Nair',
      email: 'priya@raava.local',
      passwordHash,
      role: 'CITIZEN',
      trustScore: 70,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [78.4625, 17.3550]
      }
    });
  }

  // ---------------------------------------------------------
  // 5. Volunteer profile one
  // ---------------------------------------------------------
  let volunteerProfileOne = await Volunteer.findOne({
    userId: volunteerOne._id
  });

  if (!volunteerProfileOne) {
    volunteerProfileOne = await Volunteer.create({
      userId: volunteerOne._id,
      skills: [
        'First Aid',
        'Medical Assistance',
        'Search & Rescue'
      ],
      availability: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      experience: 4,
      location: {
        type: 'Point',
        coordinates: [78.4870, 17.3850]
      }
    });
  }

  // ---------------------------------------------------------
  // 6. Volunteer profile two
  // ---------------------------------------------------------
  let volunteerProfileTwo = await Volunteer.findOne({
    userId: volunteerTwo._id
  });

  if (!volunteerProfileTwo) {
    volunteerProfileTwo = await Volunteer.create({
      userId: volunteerTwo._id,
      skills: [
        'Logistics',
        'Communication',
        'Resource Coordination'
      ],
      availability: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      experience: 3,
      location: {
        type: 'Point',
        coordinates: [78.4297, 17.3997]
      }
    });
  }

  // ---------------------------------------------------------
  // 7. Demo verified incident
  // ---------------------------------------------------------
  let incident = await Incident.findOne({
    title: 'Flooding near low-lying residential area',
    reporterId: citizen._id
  });

  if (!incident) {
    incident = await Incident.create({
      reporterId: citizen._id,
      incidentType: 'Flood',
      title: 'Flooding near low-lying residential area',
      description:
        'Street waterlogging and emergency rescue support required near the central colony after sudden heavy rain.',
      location: {
        type: 'Point',
        coordinates: [78.4400, 17.4200],
        address: 'Madhapur, Hyderabad'
      },
      severity: 'High',
      status: 'VERIFIED',
      verificationStatus: 'VERIFIED',
      requiredSkills: [
        'First Aid',
        'Search & Rescue',
        'Logistics'
      ],
      evidenceIds: []
    });
  }

  return {
    created: 1,
    coordinator: {
      id: coordinator._id,
      email: coordinator.email
    },
    users: 4,
    volunteers: 2,
    incidents: incident ? 1 : 0
  };
};