import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = ''
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-250',
    danger: 'bg-rose-50 text-rose-700 border-rose-250',
    warning: 'bg-amber-50 text-amber-700 border-amber-250',
    info: 'bg-sky-50 text-sky-700 border-sky-250',
    neutral: 'bg-slate-50 text-slate-600 border-slate-250'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
