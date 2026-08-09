import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  FileText, 
  Camera, 
  UserCheck, 
  Sparkles, 
  Scale, 
  Map, 
  Menu, 
  X,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const workflowSteps = [
    {
      num: '01',
      icon: FileText,
      title: 'Incident Report',
      desc: 'Citizen submits disaster report details through the framework interface.'
    },
    {
      num: '02',
      icon: Camera,
      title: 'Evidence Collection',
      desc: 'Submission forces mandatory upload of image/video verification evidence.'
    },
    {
      num: '03',
      icon: UserCheck,
      title: 'Multi-Source Verification',
      desc: 'System broadcasts reports to nearby citizens and volunteers to verify authenticity.'
    },
    {
      num: '04',
      icon: Sparkles,
      title: 'Severity Classification',
      desc: 'Machine learning algorithms process features to classify disaster priority.'
    },
    {
      num: '05',
      icon: Scale,
      title: 'Volunteer Matching',
      desc: 'Ranks candidate volunteers using dynamic skill matching and location details.'
    },
    {
      num: '06',
      icon: Map,
      title: 'Volunteer Allocation',
      desc: 'Dispatches nearby qualified responders and updates coordinator GIS dashboards.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-violet-150 select-none">
      
      {/* 8. LANDING PAGE — NAVIGATION */}
      <nav className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-[#7C3AED] p-2 rounded-lg text-white flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base tracking-tight block">IDRF</span>
            <span className="hidden sm:inline text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Intelligent Disaster Response Framework
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-[#7C3AED] transition-colors">About</a>
          <a href="#problem" className="hover:text-[#7C3AED] transition-colors">Problem Statement</a>
          <a href="#workflow" className="hover:text-[#7C3AED] transition-colors">How It Works</a>
          <a href="#features" className="hover:text-[#7C3AED] transition-colors">Features</a>
        </div>

        <div className="hidden md:block">
          <Link to="/dashboard">
            <Button variant="primary" className="flex items-center space-x-1.5 cursor-pointer bg-[#7C3AED] hover:bg-[#6D28D9]">
              <span>Enter Application</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-600 focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[69px] inset-x-0 bg-white border-b border-slate-200 shadow-lg z-30 p-4 space-y-3 flex flex-col">
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            About
          </a>
          <a 
            href="#problem" 
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Problem Statement
          </a>
          <a 
            href="#workflow" 
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <div className="pt-2 border-t border-slate-100">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth className="flex items-center justify-center space-x-1.5 bg-[#7C3AED]">
                <span>Enter Application</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 9. LANDING PAGE — HERO */}
      <section id="about" className="max-w-6xl w-full mx-auto px-6 py-16 md:py-24 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Intelligent Disaster <span className="text-[#7C3AED]">Response Framework</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A research-driven emergency management framework built to systematically verify disaster reports, analyze incident priority levels, and allocate local registered volunteers based on verified skills, location proximity, and availability constraints.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full justify-center flex items-center space-x-2 bg-[#7C3AED] hover:bg-[#6D28D9] px-6 py-3 text-base">
                <span>Explore Dashboard</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link to="/incidents" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full justify-center px-6 py-3 text-base">
                View Reported Incidents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. LANDING PAGE — PROBLEM STATEMENT */}
      <section id="problem" className="bg-[#F8FAFC] border-y border-slate-200 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">The Core Problem in Disaster Response</h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">Key limitations observed in traditional reporting platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg w-10 h-10 flex items-center justify-center border border-rose-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Unreliable Reporting & Misinformation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional emergency management sites assume all user submissions are genuine. Anonymous or unverified text reports lead to malicious false requests, duplication of records, and severe delays in emergency services reaching actual victims.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg w-10 h-10 flex items-center justify-center border border-rose-100">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Inefficient Volunteer Deployment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Volunteers are commonly allocated manually or in bulk without verifying details. Active dispatch workflows often fail to calculate geographical distance, available shift cycles, or match specific disaster skills, causing resource bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. LANDING PAGE — HOW IT WORKS */}
      <section id="workflow" className="max-w-6xl w-full mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Operational System Workflow</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">Six automated stages of verified response operations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative hover:border-[#DDD6FE] transition-colors group">
                <div className="absolute top-4 right-4 font-mono font-bold text-slate-200 text-2xl group-hover:text-violet-200 transition-colors">
                  {step.num}
                </div>
                <div className="p-2.5 bg-violet-50 text-[#7C3AED] border border-[#DDD6FE] rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. LANDING PAGE — CORE FEATURES */}
      <section id="features" className="bg-[#F8FAFC] border-y border-slate-200 py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Core System Architecture Features</h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">Intelligent modules addressing traditional platform gaps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">Contribution 1</span>
              <h3 className="font-bold text-lg text-slate-900">Multi-Source Disaster Verification</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Verifies reports before allocation using multiple channels (platform users, local citizens, and volunteers). Includes a Strong Confirmation rule for speed and a manual coordinator fallback loop for safety.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">Contribution 2</span>
              <h3 className="font-bold text-lg text-slate-900">ML-Based Severity Classification</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Proposed severity assessment module built to evaluate disaster details and predict required volunteer resources, skills, and emergency dispatch priority categories.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">Contribution 3</span>
              <h3 className="font-bold text-lg text-slate-900">Intelligent Volunteer Allocation</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Automatic candidates ranking using a weighted scoring metric checking required skills match (50%), distance from report (30%), and availability shifts (20%).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">Contribution 4</span>
              <h3 className="font-bold text-lg text-slate-900">Location Intelligence & Mapping</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Comprehensive coordinate-aware interface plotting incident indicators and nearby volunteer markers, with geographic distance calculated using the Haversine equation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. LANDING PAGE — SYSTEM OVERVIEW */}
      <section className="max-w-4xl w-full mx-auto px-6 py-20 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Data Pipeline</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">The flow of information from reporting to emergency response.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 pt-6 text-xs font-semibold text-slate-700">
          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg w-full md:w-auto shadow-xs">
            Users
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 md:rotate-0" />
          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg w-full md:w-auto shadow-xs">
            Incident Reports
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 md:rotate-0" />
          <div className="bg-[#F3E8FF] border border-[#DDD6FE] text-[#7C3AED] px-4 py-3 rounded-lg w-full md:w-auto shadow-xs">
            MDVF Verification
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 md:rotate-0" />
          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg w-full md:w-auto shadow-xs">
            Severity Analysis
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 md:rotate-0" />
          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg w-full md:w-auto shadow-xs">
            Volunteer Matching
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 md:rotate-0" />
          <div className="bg-[#7C3AED] text-white px-4 py-3 rounded-lg w-full md:w-auto shadow-xs">
            Active Response
          </div>
        </div>
      </section>

      {/* 14. LANDING PAGE — PROJECT INFORMATION */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-left space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Context</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">B.Tech Major Project — CSE Group 4</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-slate-655 text-sm leading-relaxed space-y-4">
            <p>
              This disaster response platform represents the frontend implementation of our B.Tech major project. It serves as a centralized operations hub to verify citizen alerts, deploy local volunteers to confirmed threats, and prevent false reporting loops.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Faculty Supervisor</span>
                <span>Mrs. Arti Budhiraja</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Academic Session</span>
                <span>2026-2027</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Core Development</span>
                <span>Phase 2 Presentation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. LANDING PAGE — FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-800">Intelligent Disaster Response Framework (IDRF)</p>
        <p className="mt-1">Developed for CSE Major Project, supervised by Mrs. Arti Budhiraja.</p>
        <p className="text-[10px] text-slate-400 mt-2">© 2026-2027 IDRF Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
