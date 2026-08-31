import React, { useState, useEffect } from 'react';
import { AuditLog } from '../../types';
import { api } from '../../services/api';
import { History, RefreshCw, X, Filter } from 'lucide-react';

interface AuditLogsViewProps {
  onClose?: () => void;
  reportIdFilter?: string;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ onClose, reportIdFilter }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAuditLogs(reportIdFilter);
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (e) {
      console.error('Failed to load audit logs', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [reportIdFilter]);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && !log.action.toUpperCase().includes(actionFilter.toUpperCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Pharmacovigilance Compliance Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              21 CFR Part 11 / EU GVP compliant immutable record of all case creations, status changes, and clinical assessments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh Audit Logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-600">Action Filter:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATED">Created</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="STATUS">Status Updated</option>
            <option value="ASSESSMENT">Assessment</option>
            <option value="FOLLOW-UP">Follow-up</option>
            <option value="VIEWED">Viewed</option>
          </select>
        </div>

        <span className="text-slate-400 font-mono">
          Showing {filteredLogs.length} logged events
        </span>
      </div>

      {/* Logs Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Timestamp (UTC)</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Actor / Role</th>
              <th className="py-2.5 px-3">Case Reference</th>
              <th className="py-2.5 px-3">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400 italic">
                  No audit logs recorded for this criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{log.userName}</div>
                    <div className="text-[10px] text-slate-400">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono font-semibold text-teal-700">
                    {log.reportRef || log.reportId || 'SYSTEM'}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-sm">
                    <p className="line-clamp-2">{log.details}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
