import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { mockApi } from '../services/mockApi';
import type { Volunteer } from '../types';
import { Search, RefreshCw, MapPin, Award, Navigation, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export const VolunteerManagement: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');

  // Modal State
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const fetchVolunteers = () => {
    setLoading(true);
    mockApi.getVolunteers().then((data) => {
      setVolunteers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Busy': return 'warning';
      case 'Offline': return 'neutral';
      default: return 'neutral';
    }
  };

  // 30. SEARCH & 31. FILTERS
  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch = 
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill = !filterSkill || vol.skills.includes(filterSkill);
    const matchesAvailability = !filterAvailability || vol.status === filterAvailability;

    return matchesSearch && matchesSkill && matchesAvailability;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterSkill('');
    setFilterAvailability('');
  };

  // Distinct skills list from mockData
  const skillList = [
    'First Aid',
    'Search & Rescue',
    'Logistics',
    'Medical Assistance',
    'Crisis Counseling',
    'Communication',
    'Resource Coordination',
    'Water Rescue',
    'Emergency Dispatch',
    'Debris Clearance',
    'Heavy Machinery Operation'
  ];

  return (
    <div className="space-y-6 select-none bg-white text-slate-900 min-h-full">
      {/* 29. VOLUNTEER MANAGEMENT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Volunteer Roster</h2>
          <p className="text-sm text-slate-500 mt-1">View registered volunteers, search credentials, check skills, and assign coordinates.</p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={fetchVolunteers} className="flex items-center space-x-1.5 cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Roster</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
          />
        </div>
        <div>
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
          >
            <option value="">All Skills</option>
            {skillList.map((skill, idx) => (
              <option key={idx} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
          >
            <option value="">All Availabilities</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* 32. VOLUNTEER CARDS */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Fetching volunteer roster data...
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <EmptyState 
          title="No Volunteers Matched" 
          description="Try adjusting your filter preferences or search query."
          actionText="Reset Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolunteers.map((vol) => (
            <Card 
              key={vol.id}
              className="flex flex-col justify-between"
              actions={
                <Badge variant={getStatusBadgeVariant(vol.status)}>
                  {vol.status}
                </Badge>
              }
            >
              <div className="space-y-4">
                {/* Avatar Initials Block */}
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-violet-50 border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center font-bold text-sm">
                    {vol.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-none">{vol.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block mt-1">ID: {vol.id}</span>
                  </div>
                </div>

                {/* Verified Skills list */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {vol.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-[#7C3AED] border border-[#DDD6FE]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coordinates & Proximity */}
                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Coordinates:</span>
                    <span className="font-mono text-[10px] text-slate-600">{vol.location.latitude.toFixed(4)}°, {vol.location.longitude.toFixed(4)}°</span>
                  </div>
                  {vol.distanceKm !== undefined && (
                    <div className="flex items-center justify-between">
                      <span>Mock distance to disaster:</span>
                      <span className="font-semibold text-slate-700">{vol.distanceKm} km</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedVolunteer(vol)}
                  className="w-full justify-center text-xs font-semibold cursor-pointer"
                >
                  View Details
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setSelectedVolunteer(vol)}
                  className="w-full justify-center flex items-center space-x-1 text-xs font-semibold cursor-pointer text-violet-700 bg-violet-50 hover:bg-violet-100"
                >
                  <Award className="h-4 w-4" />
                  <span>Assign</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 33. VOLUNTEER DETAILS MODAL */}
      <Modal
        isOpen={selectedVolunteer !== null}
        onClose={() => setSelectedVolunteer(null)}
        title="Volunteer Profile Details"
      >
        {selectedVolunteer && (
          <div className="space-y-4 text-slate-800 text-xs">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-violet-100 text-[#7C3AED] flex items-center justify-center font-bold text-base border border-[#DDD6FE]">
                  {selectedVolunteer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{selectedVolunteer.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">ID: {selectedVolunteer.id}</span>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedVolunteer.status)}>{selectedVolunteer.status}</Badge>
            </div>

            {/* Profile body */}
            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-500 block mb-1">Contact Mock Info</span>
                <div className="space-y-1 text-slate-650">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedVolunteer.name.toLowerCase().replace(' ', '.')}@idrf.org</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>+91 98480 22338</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-500 block mb-1.5">Verified Capabilities</span>
                <div className="flex flex-wrap gap-1">
                  {selectedVolunteer.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-500 block">Coordinates</span>
                  <div className="flex items-center space-x-1 text-slate-700 font-semibold mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedVolunteer.location.latitude.toFixed(4)}°, {selectedVolunteer.location.longitude.toFixed(4)}°</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Proximity Distance</span>
                  <div className="flex items-center space-x-1 text-slate-700 font-semibold mt-0.5">
                    <Navigation className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedVolunteer.distanceKm || '8.2'} km</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-500 block">Active Status Allocation</span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-1 text-slate-650 flex items-start space-x-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block">No Current Operations</span>
                    <span className="text-[10px] text-slate-500">
                      {selectedVolunteer.status === 'Available' 
                        ? 'Volunteer is standby. Suitable for immediate dispatch orders.'
                        : 'Volunteer is busy with active local operations or offline.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Registered: Aug 04, 2026</span>
              </span>
              <Button variant="outline" size="sm" onClick={() => setSelectedVolunteer(null)} className="cursor-pointer">
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
