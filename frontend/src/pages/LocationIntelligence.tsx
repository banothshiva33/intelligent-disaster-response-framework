import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { mockApi } from '../services/mockApi';
import type { DisasterIncident, Volunteer } from '../types';
import { IncidentVolunteerMap } from '../components/map/IncidentVolunteerMap';
import { MapPin, Navigation, Info } from 'lucide-react';

export const LocationIntelligence: React.FC = () => {
  const [incidents, setIncidents] = useState<DisasterIncident[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([mockApi.getIncidents(), mockApi.getVolunteers()]).then(
      ([incData, volData]) => {
        setIncidents(incData);
        setVolunteers(volData);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="space-y-6 select-none bg-white text-slate-900 min-h-full">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Location Intelligence</h2>
          <p className="text-sm text-slate-500 mt-1">Geospatial tracking of verified disasters and registered volunteer coordinates.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold bg-violet-50 text-[#7C3AED] px-3 py-1.5 rounded-lg border border-[#DDD6FE]">
          <span>GIS Visualization</span>
        </div>
      </div>

      {/* Main Map Container & details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Map visualization (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 relative">
            {loading ? (
              <div className="h-[550px] w-full flex items-center justify-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex flex-col items-center space-y-2">
                  <span className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></span>
                  <span>Loading GIS Maps...</span>
                </div>
              </div>
            ) : (
              <IncidentVolunteerMap incidents={incidents} volunteers={volunteers} />
            )}
          </Card>

          {/* Map Legend */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-rose-50 border border-rose-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              </div>
              <span>Disaster Incident (Red Alert)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-violet-50 border border-violet-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              </div>
              <span>Available Volunteer (Purple User)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-slate-50 border border-slate-400 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-550"></span>
              </div>
              <span>Busy / Offline Volunteer (Gray User)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar summaries (1 col) */}
        <div className="space-y-6">
          {/* Active summary counts */}
          <Card title="Roster Highlights" subtitle="Active map indicators">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-550 font-medium">Mapped Disasters</span>
                <Badge variant="danger">{incidents.length}</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-550 font-medium">Available Responders</span>
                <Badge variant="success">
                  {volunteers.filter(v => v.status === 'Available').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-550 font-medium">Busy / Offline</span>
                <Badge variant="neutral">
                  {volunteers.filter(v => v.status !== 'Available').length}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Guidelines notes */}
          <Card title="GIS Information" subtitle="Coordinate proximity features">
            <div className="space-y-3.5 text-xs leading-relaxed text-slate-655">
              <div className="flex items-start space-x-2 bg-violet-50 border border-[#DDD6FE] text-[#7C3AED] rounded-lg p-3">
                <Info className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] leading-normal font-medium">
                  Travel distances on map pops represent **Haversine displacement** calculations in kilometers.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px]">
                    Map plots use coordinate pins mapped dynamically to Hyderabad city quadrants.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Navigation className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px]">
                    In future integrations, volunteers will sync real-time GPS coordinates directly via mobile clients.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default LocationIntelligence;
