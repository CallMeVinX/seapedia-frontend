import React from 'react';
import { CheckCircle, Truck, Package, Clock } from 'lucide-react';
import { FormattedTrackingStep } from '@/hooks/useOrderTracking';

interface TrackingTimelineProps {
  trackingSteps: FormattedTrackingStep[];
  isLoading?: boolean;
}

const getStatusIcon = (statusName: string, isCompleted: boolean) => {
  const normalized = statusName.toLowerCase();
  
  if (normalized.includes('selesai') || normalized.includes('completed')) {
    return <CheckCircle className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />;
  }
  if (normalized.includes('dikirim') || normalized.includes('shipping') || normalized.includes('driver')) {
    return <Truck className={`w-6 h-6 ${isCompleted ? 'text-blue-500' : 'text-gray-300'}`} />;
  }
  if (normalized.includes('dikemas') || normalized.includes('packing')) {
    return <Package className={`w-6 h-6 ${isCompleted ? 'text-orange-500' : 'text-gray-300'}`} />;
  }
  
  return <Clock className={`w-6 h-6 ${isCompleted ? 'text-blue-500' : 'text-gray-300'}`} />;
};

const getStatusColor = (statusName: string) => {
  const normalized = statusName.toLowerCase();
  if (normalized.includes('selesai') || normalized.includes('completed')) return 'bg-green-500';
  if (normalized.includes('dikirim') || normalized.includes('shipping') || normalized.includes('driver')) return 'bg-blue-500';
  if (normalized.includes('dikemas') || normalized.includes('packing')) return 'bg-orange-500';
  return 'bg-blue-500';
};

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ trackingSteps, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!trackingSteps || trackingSteps.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
        Belum ada data pelacakan.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Riwayat Pengiriman</h3>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {trackingSteps.map((step, index) => {
            const isLast = index === trackingSteps.length - 1;
            const isCompleted = step.isCompleted;
            const statusColor = getStatusColor(step.status_name);

            return (
              <div key={step.id || index} className="relative flex items-start group">
                {/* Active Line Override */}
                {isCompleted && !isLast && (
                  <div className={`absolute left-3 top-6 bottom-[-1.5rem] w-0.5 ${statusColor} opacity-50`} />
                )}

                {/* Icon Circle */}
                <div className={`relative z-10 flex items-center justify-center bg-white rounded-full p-1 ring-4 ring-white ${isLast ? 'animate-pulse' : ''}`}>
                  {getStatusIcon(step.status_name, isCompleted)}
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h4 className={`font-semibold text-lg ${isLast ? 'text-gray-900' : 'text-gray-600'}`}>
                      {step.status_name}
                    </h4>
                    <span className="text-sm text-gray-400 mt-1 sm:mt-0">
                      {step.timeFormatted}
                    </span>
                  </div>
                  
                  {step.changed_by_role && (
                    <p className="text-sm text-gray-500 mt-1">
                      Diperbarui oleh: <span className="font-medium capitalize">{step.changed_by_role}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
