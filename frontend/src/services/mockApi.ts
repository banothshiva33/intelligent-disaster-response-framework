import { mockIncidents, mockVolunteers } from '../data/mockData';
import type { DisasterIncident, Volunteer } from '../types';

const DELAY = 300; // simulated network delay in ms

export const mockApi = {
  getIncidents: async (): Promise<DisasterIncident[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockIncidents]);
      }, DELAY);
    });
  },

  getIncidentById: async (id: string): Promise<DisasterIncident | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockIncidents.find(inc => inc.id === id));
      }, DELAY);
    });
  },

  getVolunteers: async (): Promise<Volunteer[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockVolunteers]);
      }, DELAY);
    });
  },

  createIncident: async (incident: Omit<DisasterIncident, 'id' | 'createdAt'>): Promise<DisasterIncident> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newIncident: DisasterIncident = {
          ...incident,
          id: `inc-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          createdAt: new Date().toISOString()
        };
        mockIncidents.unshift(newIncident);
        resolve(newIncident);
      }, DELAY);
    });
  }
};
