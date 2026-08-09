import type { DisasterIncident, Volunteer } from '../types';

export const mockIncidents: DisasterIncident[] = [
  {
    id: 'inc-001',
    title: 'Severe Urban Flooding',
    description: 'Heavy rainfall has caused waterlogging up to 4 feet in residential areas. Residents are stranded on upper floors.',
    type: 'Flood',
    location: {
      latitude: 17.3850,
      longitude: 78.4867,
      address: 'Begumpet, Hyderabad'
    },
    severity: 'High',
    status: 'Verified',
    evidenceUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-09T22:30:00Z'
  },
  {
    id: 'inc-002',
    title: 'Minor Landslide on Highway',
    description: 'Mud and rocks blocking the highway. No casualties reported, but traffic is completely blocked.',
    type: 'Landslide',
    location: {
      latitude: 17.4200,
      longitude: 78.5000,
      address: 'Secunderabad Route, Hyderabad'
    },
    severity: 'Medium',
    status: 'Pending',
    evidenceUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-09T23:15:00Z'
  },
  {
    id: 'inc-003',
    title: 'Structural Fire in Commercial Complex',
    description: 'Electrical short circuit triggered a fire on the second floor. Fire trucks are on the way, volunteers needed for crowd control and evacuation.',
    type: 'Fire',
    location: {
      latitude: 17.3616,
      longitude: 78.4747,
      address: 'Charminar Area, Hyderabad'
    },
    severity: 'High',
    status: 'Verified',
    evidenceUrl: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-09T23:45:00Z'
  },
  {
    id: 'inc-004',
    title: 'Report of Fallen Tree blocking Metro lane',
    description: 'A large tree has fallen across the service lane near the metro station. Need tools to clear the road.',
    type: 'Accident',
    location: {
      latitude: 17.4483,
      longitude: 78.3741,
      address: 'Hitech City, Hyderabad'
    },
    severity: 'Low',
    status: 'Callback',
    evidenceUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-10T00:02:00Z'
  },
  {
    id: 'inc-005',
    title: 'Suspected Gas Leak',
    description: 'Strong smell of gas reported near the industrial estate. Needs verification and air quality testing.',
    type: 'Accident',
    location: {
      latitude: 17.5000,
      longitude: 78.4000,
      address: 'Balanagar Industrial Area, Hyderabad'
    },
    severity: 'Medium',
    status: 'Pending',
    evidenceUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-10T00:05:00Z'
  }
];

export const mockVolunteers: Volunteer[] = [
  {
    id: 'vol-001',
    name: 'S. Shiva',
    skills: ['First Aid', 'Search & Rescue', 'Logistics'],
    status: 'Available',
    location: {
      latitude: 17.3900,
      longitude: 78.4700
    },
    distanceKm: 2.1
  },
  {
    id: 'vol-002',
    name: 'G. Mahipal',
    skills: ['Medical Assistance', 'Crisis Counseling', 'Communication'],
    status: 'Available',
    location: {
      latitude: 17.4100,
      longitude: 78.4900
    },
    distanceKm: 3.5
  },
  {
    id: 'vol-003',
    name: 'Madiha Fathima',
    skills: ['Logistics', 'First Aid', 'Resource Coordination'],
    status: 'Busy',
    location: {
      latitude: 17.3700,
      longitude: 78.4600
    },
    distanceKm: 4.8
  },
  {
    id: 'vol-004',
    name: 'P. Srihitha',
    skills: ['Water Rescue', 'First Aid', 'Emergency Dispatch'],
    status: 'Available',
    location: {
      latitude: 17.4500,
      longitude: 78.3800
    },
    distanceKm: 12.3
  },
  {
    id: 'vol-005',
    name: 'K. Rajesh',
    skills: ['Debris Clearance', 'Logistics', 'Heavy Machinery Operation'],
    status: 'Offline',
    location: {
      latitude: 17.4800,
      longitude: 78.4300
    },
    distanceKm: 8.9
  }
];
