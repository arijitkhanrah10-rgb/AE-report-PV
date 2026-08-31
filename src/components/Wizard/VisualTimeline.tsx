import React from 'react';
import {
  Pill,
  AlertTriangle,
  HeartPulse,
  CheckCircle,
  PauseCircle,
  Clock,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { TimelineEvent, TimelineStage } from '../../types';

interface VisualTimelineProps {
  timeline: TimelineEvent[];
  onAddEvent?: (event: TimelineEvent) => void;
  onRemoveEvent?: (id: string) => void;
  isEditable?: boolean;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
  timeline,
  onAddEvent,
  onRemoveEvent,
  isEditable = false,
}) => {
  const getStageIcon = (stage: TimelineStage) => {
    switch (stage) {
      case 'Medication Started':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'Medication Taken':
        return <Pill className="w-4 h-4 text-teal-600" />;
      case 'Symptoms Appeared':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'Medication Stopped/Continued':
        return <PauseCircle className="w-4 h-4 text-amber-600" />;
      case 'Medical Treatment':
        return <HeartPulse className="w-4 h-4 text-blue-600" />;
      case 'Current Outcome':
        return <CheckCircle className="w-4 h-4 text-indigo-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStageBadgeColor = (stage: TimelineStage) => {
    switch (stage) {
      case 'Medication Started':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Medication Taken':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Symptoms Appeared':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Medication Stopped/Continued':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Medical Treatment':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Current Outcome':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Standard Step Sequence Infographic */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Clinical Event Sequence Reference:
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-600">
          <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">1. Medication Started</span>
          <span>→</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">2. Medication Taken</span>
          <span>→</span>
          <span className="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-md">3. Symptoms Appeared</span>
          <span>→</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">4. Medication Stopped/Continued</span>
          <span>→</span>
          <span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">5. Medical Treatment</span>
          <span>→</span>
          <span className="px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md">6. Current Outcome</span>
        </div>
      </div>

      {/* Visual Chronological Timeline */}
      {timeline.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
          <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="font-semibold text-slate-700">No timeline milestones configured yet</p>
          <p className="mt-1">Timeline milestones are automatically mapped from your Medication and Event dates.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timeline.map((event, idx) => (
            <div key={event.id || idx} className="relative group">
              {/* Timeline marker icon */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-xs group-hover:border-teal-500 transition-colors">
                {getStageIcon(event.stage)}
              </div>

              {/* Event Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${getStageBadgeColor(event.stage)}`}>
                    {event.stage}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.date || 'Date not specified'}</span>
                    {event.time && <span>({event.time})</span>}
                  </div>
                </div>

                <h5 className="text-sm font-bold text-slate-900">{event.title}</h5>
                {event.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>
                )}

                {isEditable && onRemoveEvent && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onRemoveEvent(event.id)}
                      className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove milestone</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
