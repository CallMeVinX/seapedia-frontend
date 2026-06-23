import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  iconBgColor = 'bg-blue-50',
  iconTextColor = 'text-blue-500'
}) => {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center">
      <div className={`w-24 h-24 ${iconBgColor} ${iconTextColor} rounded-full flex items-center justify-center mb-6`}>
        <Icon className="w-12 h-12" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
