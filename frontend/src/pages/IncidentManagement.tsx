import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { mockApi } from '../services/mockApi';
import type { DisasterIncident, IncidentSeverity, IncidentStatus } from '../types';
import { Plus, Eye, Info, RefreshCw, Search, Calendar, MapPin, Navigation, Film } from 'lucide-react';

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<DisasterIncident[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal States
  const [selectedIncident, setSelectedIncident] = useState<DisasterIncident | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Flood');
  const [newDescription, setNewDescription] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newLat, setNewLat] = useState('17.4000');
  const [newLng, setNewLng] = useState('78.4500');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('Medium');

  const fetchIncidents = () => {
    setLoading(true);
    mockApi.getIncidents().then((data) => {
      setIncidents(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Verified': return 'success';
      case 'Pending': return 'warning';
      case 'Callback': return 'info';
      case 'Rejected': return 'danger';
      default: return 'neutral';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'neutral';
    }
  };

  // 24. INCIDENT SEARCH & 25. FILTERS
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = !filterType || inc.type === filterType;
    const matchesSeverity = !filterSeverity || inc.severity === filterSeverity;
    const matchesStatus = !filterStatus || inc.status === filterStatus;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Handle Form Submit
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newAddress) return;

    const incidentData = {
      title: newTitle,
      description: newDescription,
      type: newType,
      location: {
        latitude: parseFloat(newLat) || 17.4000,
        longitude: parseFloat(newLng) || 78.4500,
        address: newAddress
      },
      severity: newSeverity,
      status: 'Pending' as IncidentStatus,
      evidenceUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80' // default mock evidence
    };

    mockApi.createIncident(incidentData).then((newInc) => {
      // Prepend to local incidents array state
      setIncidents([newInc, ...incidents]);
      setReportModalOpen(false);
      
      // Clear Form
      setNewTitle('');
      setNewDescription('');
      setNewAddress('');
      setNewSeverity('Medium');
      setNewType('Flood');
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('');
    setFilterSeverity('');
    setFilterStatus('');
  };

  return (
    <div className="space-y-6 select-none bg-white text-slate-900 min-h-full">
      {/* Page Title & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Incident Management</h2>
          <p className="text-sm text-slate-500 mt-1">Review reported incidents, search submissions, and update verification flags.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={fetchIncidents} className="flex items-center space-x-1.5 cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => setReportModalOpen(true)} className="flex items-center space-x-1.5 cursor-pointer bg-[#7C3AED] hover:bg-[#6D28D9]">
            <Plus className="h-4 w-4" />
            <span>Report Incident</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, details, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
          />
        </div>
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
          >
            <option value="">All Categories</option>
            <option value="Flood">Flood</option>
            <option value="Fire">Fire</option>
            <option value="Landslide">Landslide</option>
            <option value="Accident">Accident</option>
          </select>
        </div>
        <div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
          >
            <option value="">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
          >
            <option value="">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Callback">Callback</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Incident Table */}
      <Card>
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Fetching incident records...
          </div>
        ) : filteredIncidents.length === 0 ? (
          <EmptyState 
            title="No Incidents Found" 
            description="No incidents match the active search query or filter tags."
            actionText="Reset Filter Options"
            onAction={clearFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-[10px]">Incident Detail</th>
                  <th className="py-3 px-4 text-[10px]">Type</th>
                  <th className="py-3 px-4 text-[10px]">Address</th>
                  <th className="py-3 px-4 text-[10px]">Severity</th>
                  <th className="py-3 px-4 text-[10px]">Status</th>
                  <th className="py-3 px-4 text-[10px]">Reported At</th>
                  <th className="py-3 px-4 text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{inc.title}</span>
                      <span className="text-[11px] text-slate-550 truncate block max-w-xs">{inc.description}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{inc.type}</td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[150px]">{inc.location.address}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={getSeverityBadgeVariant(inc.severity)}>
                        {inc.severity}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={getStatusBadgeVariant(inc.status)}>
                        {inc.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-450">
                      {new Date(inc.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedIncident(inc)}
                          className="px-2 py-1 cursor-pointer"
                          aria-label="View Details"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* 27. INCIDENT DETAILS MODAL */}
      <Modal
        isOpen={selectedIncident !== null}
        onClose={() => setSelectedIncident(null)}
        title="Disaster Incident Details"
      >
        {selectedIncident && (
          <div className="space-y-4 text-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">ID: {selectedIncident.id}</span>
              <Badge variant={getStatusBadgeVariant(selectedIncident.status)}>{selectedIncident.status}</Badge>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">{selectedIncident.title}</h4>
              <p className="text-slate-600 leading-relaxed">{selectedIncident.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <span className="font-bold text-slate-500 block">Category</span>
                <span className="text-slate-800 font-semibold">{selectedIncident.type}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block">Severity Level</span>
                <Badge variant={getSeverityBadgeVariant(selectedIncident.severity)} className="mt-0.5">
                  {selectedIncident.severity}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-500 block">Incident Location</span>
              <div className="flex items-start space-x-1.5 text-slate-700">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{selectedIncident.location.address}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-500 pl-5 font-mono text-[10px]">
                <Navigation className="h-3.5 w-3.5 text-slate-350" />
                <span>Lat: {selectedIncident.location.latitude.toFixed(4)}°, Lng: {selectedIncident.location.longitude.toFixed(4)}°</span>
              </div>
            </div>

            {selectedIncident.evidenceUrl && (
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-500 flex items-center space-x-1">
                  <Film className="h-3.5 w-3.5 text-slate-400" />
                  <span>Mandatory Report Evidence</span>
                </span>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center relative">
                  <img 
                    src={selectedIncident.evidenceUrl} 
                    alt={selectedIncident.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/60 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs select-none">
                    Evidence Verified
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Reported At: {new Date(selectedIncident.createdAt).toLocaleString()}</span>
              </span>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedIncident(null)} className="cursor-pointer">
                Close Panel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 28. REPORT INCIDENT FORM MODAL */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Emergency Incident"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 text-xs text-slate-800">
          <div className="bg-violet-50 border border-[#DDD6FE] text-[#7C3AED] rounded-lg p-3 flex items-start space-x-1.5">
            <Info className="h-4.5 w-4.5 text-violet-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] leading-normal font-medium">
              Submitting this form demonstrates frontend data append operations in Phase 2. No backend database operations are executed.
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Incident Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Broken Water Pipeline Flooding"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Incident Type *</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="Flood">Flood</option>
                <option value="Fire">Fire</option>
                <option value="Landslide">Landslide</option>
                <option value="Accident">Accident</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Severity Level *</label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Enter exact emergency details, stranded victims, hazards..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED] resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Location Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jubilee Hills, Rd No 36, Hyderabad"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Latitude *</label>
              <input
                type="text"
                required
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Longitude *</label>
              <input
                type="text"
                required
                value={newLng}
                onChange={(e) => setNewLng(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setReportModalOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="cursor-pointer bg-[#7C3AED] hover:bg-[#6D28D9]">
              Submit Incident Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
