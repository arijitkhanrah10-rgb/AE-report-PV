import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, PhoneCall } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-sm border-b border-amber-600/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2.5 flex-1 font-medium">
          <span className="p-1 bg-amber-950 text-amber-300 rounded-full inline-flex shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded mr-1.5">
              Medical Safety Notice
            </span>
            <span>
              This reporting system is <strong>not intended for medical emergencies</strong>. If you or someone else is experiencing an acute or life-threatening medical emergency, contact your local emergency services (e.g., 911 / 112 / 999) immediately.
            </span>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-950/80 hover:text-amber-950 p-1 hover:bg-amber-400/40 rounded transition-colors shrink-0"
          title="Dismiss safety alert"
          aria-label="Dismiss safety alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
