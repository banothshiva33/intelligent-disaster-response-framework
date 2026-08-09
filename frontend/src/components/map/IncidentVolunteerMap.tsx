import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { DisasterIncident, Volunteer } from '../../types';

interface MapProps {
  incidents: DisasterIncident[];
  volunteers: Volunteer[];
}

// Custom SVG Icons using L.divIcon to prevent Vite asset resolution issues
const incidentIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 border-2 border-rose-500 shadow-md">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -12]
});

const availableVolIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-violet-55 border-2 border-violet-500 shadow-md">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -12]
});

const busyVolIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-400 shadow-md">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="22" y2="13"/><line x1="22" y1="8" x2="17" y2="13"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -12]
});

export const IncidentVolunteerMap: React.FC<MapProps> = ({ incidents, volunteers }) => {
  const centerPosition: [number, number] = [17.4150, 78.4500]; // Hyderabad centroid position
  
  return (
    <div className="h-[550px] w-full relative z-10 rounded-xl overflow-hidden shadow-xs border border-slate-200">
      <MapContainer 
        center={centerPosition} 
        zoom={12} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Incidents */}
        {incidents.map((inc) => (
          <Marker 
            key={inc.id} 
            position={[inc.location.latitude, inc.location.longitude]} 
            icon={incidentIcon}
          >
            <Popup>
              <div className="p-1 space-y-1 text-slate-800 leading-normal">
                <div className="flex items-center justify-between space-x-2">
                  <span className="font-bold text-sm block">{inc.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    inc.severity === 'High' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {inc.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{inc.description}</p>
                <div className="pt-1.5 flex items-center justify-between text-[10px] border-t border-slate-100 text-slate-400">
                  <span>Type: <strong className="text-slate-655 font-semibold">{inc.type}</strong></span>
                  <span>Status: <strong className="text-slate-655 font-semibold">{inc.status}</strong></span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Volunteers */}
        {volunteers.map((vol) => (
          <Marker 
            key={vol.id} 
            position={[vol.location.latitude, vol.location.longitude]} 
            icon={vol.status === 'Available' ? availableVolIcon : busyVolIcon}
          >
            <Popup>
              <div className="p-1 space-y-1 text-slate-800 leading-normal">
                <div className="flex items-center justify-between space-x-2">
                  <span className="font-bold text-sm block">{vol.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    vol.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {vol.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Skills: {vol.skills.join(', ')}</p>
                <div className="pt-1.5 flex items-center justify-between text-[10px] border-t border-slate-100 text-slate-400">
                  <span>ID: {vol.id}</span>
                  <span>Mock Distance: {vol.distanceKm} km</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
export default IncidentVolunteerMap;
