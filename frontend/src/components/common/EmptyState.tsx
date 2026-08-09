import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Search } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Search,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 max-w-md mx-auto my-6">
      <div className="p-3.5 bg-slate-50 rounded-full text-slate-400 mb-4 border border-slate-100 flex items-center justify-center">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-semibold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="cursor-pointer">
          {actionText}
        </Button>
      )}
    </div>
  );
};
