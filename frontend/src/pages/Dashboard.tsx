import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { 
  FileText, 
  CheckCircle2, 
  Users, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { mockApi } from '../services/mockApi';
import type { DisasterIncident } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<DisasterIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getIncidents().then((data) => {
      setIncidents(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const stats = [
    { title: 'Total Incident Reports', value: '142', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { title: 'Verified Incidents', value: '98', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Pending Verification', value: '32', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Active Emergency Alerts', value: '12', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { title: 'Available Volunteers', value: '25', icon: Users, color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { title: 'Deployed Volunteers', value: '37', icon: ShieldCheck, color: 'text-sky-600 bg-sky-50 border-sky-100' }
  ];

  // Recharts Chart Mock Data
  const trendData = [
    { name: 'Mon', Reports: 12 },
    { name: 'Tue', Reports: 19 },
    { name: 'Wed', Reports: 15 },
    { name: 'Thu', Reports: 22 },
    { name: 'Fri', Reports: 30 },
    { name: 'Sat', Reports: 25 },
    { name: 'Sun', Reports: 28 },
  ];

  const severityData = [
    { name: 'High', value: 35 },
    { name: 'Medium', value: 45 },
    { name: 'Low', value: 20 },
  ];
  const SEVERITY_COLORS = ['#EF4444', '#F59E0B', '#10B981']; // red, amber, emerald

  const typeData = [
    { name: 'Flood', count: 42 },
    { name: 'Fire', count: 28 },
    { name: 'Landslide', count: 18 },
    { name: 'Accident', count: 32 },
  ];

  return (
    <div className="space-y-6 select-none bg-white text-slate-900 min-h-full">
      {/* 16. DASHBOARD TITLE & SUBTITLE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analytics Overview</h2>
          <p className="text-sm text-slate-500 mt-1">
            Monitor disaster incidents, verification status, severity and volunteer response.
          </p>
        </div>
        <div>
          <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>System Active</span>
          </span>
        </div>
      </div>

      {/* 17. DASHBOARD — METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
              <div className={`p-2.5 rounded-lg border ${stat.color} flex-shrink-0 flex items-center justify-center`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-550 uppercase tracking-wider truncate">{stat.title}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of charts & details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Trend and recent feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* 18. INCIDENT TREND CHART */}
          <Card title="Incident Reports Over Time" subtitle="Aggregated count of weekly citizen submissions">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#E2E8F0' }} />
                  <Area type="monotone" dataKey="Reports" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 21. DASHBOARD — RECENT INCIDENTS */}
          <Card 
            title="Recent Incident Reports" 
            subtitle="Recent citizen incident submissions pending triage"
            actions={
              <Link to="/incidents">
                <Button variant="outline" size="sm" className="flex items-center space-x-1 font-semibold text-xs">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          >
            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Loading incidents feed...
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div 
                    key={inc.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{inc.title}</span>
                        <Badge variant={inc.status === 'Verified' ? 'success' : inc.status === 'Pending' ? 'warning' : 'info'}>
                          {inc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{inc.location.address}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-xs">
                      <span className="text-slate-400">
                        {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`font-bold ${
                        inc.severity === 'High' ? 'text-rose-600' : inc.severity === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {inc.severity} Severity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Severity, category charts, workflow logs */}
        <div className="space-y-6">
          {/* 19. DASHBOARD — SEVERITY DISTRIBUTION */}
          <Card title="Severity Distribution" subtitle="Proportion of incident priorities">
            <div className="h-40 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-slate-800">142</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Reports</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 text-xs font-semibold pt-2">
              {severityData.map((d, i) => (
                <div key={i} className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[i] }}></span>
                  <span className="text-slate-650">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 20. DASHBOARD — INCIDENT TYPE DISTRIBUTION */}
          <Card title="Incident Category Spread" subtitle="Volume by incident type tags">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 22. DASHBOARD — WORKFLOW STATUS */}
          <Card title="Demo Workflow Status" subtitle="Framework pipeline representation">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 mb-4 flex items-start space-x-2">
              <Info className="h-4.5 w-4.5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-800 leading-normal font-medium">
                This dashboard displays a **frontend mock representation** of active systems. AI predictions and volunteer calculations are simulated locally.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs leading-relaxed">
                <div className="bg-violet-50 border border-[#DDD6FE] text-[#7C3AED] p-1.5 rounded-full mt-0.5 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">1. Evidence Verification</span>
                  <span className="text-slate-500">Image/video uploads required; anonymous texts blocked automatically.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs leading-relaxed">
                <div className="bg-violet-50 border border-[#DDD6FE] text-[#7C3AED] p-1.5 rounded-full mt-0.5 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">2. Multi-Source Check (MDVF)</span>
                  <span className="text-slate-500">Alerts nearby users to verify; coordinator checks fallback calls.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs leading-relaxed">
                <div className="bg-violet-50 border border-[#DDD6FE] text-[#7C3AED] p-1.5 rounded-full mt-0.5 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">3. Priority Classifier (AI/ML)</span>
                  <span className="text-slate-500">Calculates severity metrics and volunteer resources required.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs leading-relaxed">
                <div className="bg-violet-50 border border-[#DDD6FE] text-[#7C3AED] p-1.5 rounded-full mt-0.5 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">4. Smart Allocation Dispatch</span>
                  <span className="text-slate-500">Calculates Haversine travel distances and skills matching tags.</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
