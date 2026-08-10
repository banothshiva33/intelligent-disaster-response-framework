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
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            {title && <h3 className="font-bold text-base text-slate-900 leading-tight">{title}</h3>}
            {subtitle && <p className="text-[11px] text-slate-500 mt-1 font-medium">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
export default Card;
