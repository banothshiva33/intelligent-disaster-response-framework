export type UserRole = 'Citizen' | 'Volunteer' | 'Coordinator' | 'Admin';
export type IncidentSeverity = 'Low' | 'Medium' | 'High';
export type IncidentStatus = 'Pending' | 'Verified' | 'Rejected' | 'Callback';
export type VolunteerStatus = 'Available' | 'Busy' | 'Offline';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  trustScore: number;
  isFlagged: boolean;
}

export interface IncidentLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface DisasterIncident {
  id: string;
  title: string;
  description: string;
  type: string;
  location: IncidentLocation;
  severity: IncidentSeverity;
  status: IncidentStatus;
  evidenceUrl?: string;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  status: VolunteerStatus;
  location: {
    latitude: number;
    longitude: number;
  };
  distanceKm?: number;
}
