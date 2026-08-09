import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-4">
          <div>
            {title && <h3 className="font-semibold text-lg text-slate-900 dark:text-white leading-6">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
