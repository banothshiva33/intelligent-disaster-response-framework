import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="bg-rose-50 p-4 rounded-full text-rose-600 inline-flex items-center justify-center border border-rose-100">
          <ShieldAlert className="h-16 w-16" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-500">
            The disaster response route you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" className="flex items-center space-x-2 w-full justify-center bg-[#7C3AED] hover:bg-[#6D28D9]">
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Back to Welcome Page</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
