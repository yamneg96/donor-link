import React from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  day: number;
  label: string;
  type: 'shortage' | 'restock' | 'redistribution';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface PredictionTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const PredictionTimeline: React.FC<PredictionTimelineProps> = ({ events, className }) => {
  const sortedEvents = [...events].sort((a, b) => a.day - b.day);

  return (
    <div className={cn('relative pl-8 space-y-8', className)}>
      {/* Vertical Line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-outline-variant/30" />

      {sortedEvents.map((event, index) => {
        const date = new Date();
        date.setDate(date.getDate() + event.day);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div key={index} className="relative">
            {/* Timeline Node */}
            <div 
              className={cn(
                'absolute -left-[28px] top-1 w-6 h-6 rounded-full border-2 border-white dark:border-on-background flex items-center justify-center shadow-sm',
                event.type === 'shortage' ? 'bg-error text-on-error' : 
                event.type === 'restock' ? 'bg-secondary text-on-secondary' : 
                'bg-primary text-on-primary'
              )}
            >
              <MaterialIcon 
                icon={
                  event.type === 'shortage' ? 'warning' : 
                  event.type === 'restock' ? 'inventory_2' : 
                  'local_shipping'
                } 
                size={14} 
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-tertiary uppercase tracking-tighter">
                  {event.day === 0 ? 'Today' : `Day ${event.day} (${dateStr})`}
                </span>
                <span 
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                    event.severity === 'critical' ? 'bg-error/10 text-error' : 
                    event.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-700'
                  )}
                >
                  {event.severity}
                </span>
              </div>
              <p className="text-sm text-on-surface font-medium">{event.label}</p>
            </div>
          </div>
        );
      })}

      {sortedEvents.length === 0 && (
        <p className="text-sm text-on-surface-variant italic">No upcoming intelligent events predicted.</p>
      )}
    </div>
  );
};
