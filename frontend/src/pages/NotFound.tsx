import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="bg-rose-100 dark:bg-rose-950/30 p-4 rounded-full text-rose-650 dark:text-rose-450 inline-flex items-center justify-center">
          <ShieldAlert className="h-16 w-16" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Page Not Found</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The disaster response route you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" className="flex items-center space-x-2 w-full justify-center">
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Back to Welcome Page</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
