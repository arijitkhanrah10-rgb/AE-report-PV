/**
 * SafeMeds PV - API Client Service
 */

import {
  AdverseEventReport,
  AuditLog,
  DashboardStats,
  PVAssessment,
  User,
  ReportStatus,
} from '../types';

export const api = {
  // Get KPI stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    return data.stats;
  },

  // Get all reports with optional filters
  async getReports(params: Record<string, string> = {}): Promise<AdverseEventReport[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/reports${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    const data = await res.json();
    return data.reports || [];
  },

  // Get single report
  async getReport(id: string, currentUser?: User): Promise<AdverseEventReport> {
    const headers: Record<string, string> = {};
    if (currentUser) {
      headers['x-user-id'] = currentUser.id;
      headers['x-user-name'] = currentUser.name;
      headers['x-user-role'] = currentUser.role;
    }
    const res = await fetch(`/api/reports/${id}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch report');
    const data = await res.json();
    return data.report;
  },

  // Submit report
  async submitReport(
    report: Partial<AdverseEventReport>,
    currentUser?: User
  ): Promise<{
    referenceNumber: string;
    verificationCode: string;
    id: string;
    dateSubmitted: string;
    status: ReportStatus;
    report: AdverseEventReport;
  }> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (currentUser) {
      headers['x-user-id'] = currentUser.id;
      headers['x-user-name'] = currentUser.name;
      headers['x-user-role'] = currentUser.role;
    }
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers,
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to submit adverse event report');
    }
    return res.json();
  },

  // Alias for submitReport
  async createReport(
    report: Partial<AdverseEventReport>,
    currentUser?: User
  ) {
    return this.submitReport(report, currentUser);
  },

  // Update existing report (within 5-day window)
  async updateReport(
    id: string,
    report: Partial<AdverseEventReport>,
    currentUser?: User
  ): Promise<{ success: boolean; report: AdverseEventReport; message?: string }> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (currentUser) {
      headers['x-user-id'] = currentUser.id;
      headers['x-user-name'] = currentUser.name;
      headers['x-user-role'] = currentUser.role;
    }
    const res = await fetch(`/api/reports/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to update adverse event report');
    }
    return res.json();
  },

  // Save Draft
  async saveDraft(
    draft: Partial<AdverseEventReport>,
    currentUser?: User
  ): Promise<{ draftId: string; referenceNumber: string; verificationCode: string; message: string }> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (currentUser) {
      headers['x-user-id'] = currentUser.id;
      headers['x-user-name'] = currentUser.name;
      headers['x-user-role'] = currentUser.role;
    }
    const res = await fetch('/api/drafts', {
      method: 'POST',
      headers,
      body: JSON.stringify(draft),
    });
    if (!res.ok) throw new Error('Failed to save draft');
    return res.json();
  },

  // Load Draft
  async loadDraft(ref: string): Promise<AdverseEventReport> {
    const res = await fetch(`/api/drafts/${encodeURIComponent(ref)}`);
    if (!res.ok) throw new Error('Draft not found');
    const data = await res.json();
    return data.draft;
  },

  // Check Status / Public lookup
  async checkStatus(referenceNumber: string, verificationQuery: string): Promise<{ success: boolean; data?: AdverseEventReport; error?: string }> {
    const res = await fetch('/api/reports/check-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceNumber, verificationQuery }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Failed to verify report status' };
    }
    const data = await res.json();
    return { success: true, data: data as any };
  },

  // Alias for checkStatus
  async getReportByReference(referenceNumber: string, verificationCode: string) {
    return this.checkStatus(referenceNumber, verificationCode);
  },

  // Save PV Assessment
  async saveAssessment(reportId: string, assessment: PVAssessment, reviewer?: User): Promise<{ success: boolean; data: AdverseEventReport; error?: string }> {
    const res = await fetch(`/api/reports/${reportId}/assessment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessment, reviewer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, data: {} as any, error: err.error || 'Failed to save assessment' };
    }
    const data = await res.json();
    return { success: true, data: data.report };
  },

  // Save Causality Assessment
  async saveCausalityAssessment(reportId: string, assessmentPayload: any): Promise<{ success: boolean; data: AdverseEventReport; error?: string }> {
    const currentReport = await this.getReport(reportId);
    const existing = currentReport.assessment || ({} as PVAssessment);
    const updatedAssessment: PVAssessment = {
      reviewerId: 'user_reviewer',
      reviewerName: 'Dr. Sarah Collins, PharmD',
      reviewDate: new Date().toISOString(),
      reviewerComments: assessmentPayload.rationale || existing.reviewerComments || '',
      medicalAssessment: assessmentPayload.medicalOfficerComments || existing.medicalAssessment || '',
      causalityAssessment: assessmentPayload.category || existing.causalityAssessment || 'Possible',
      causalityScale: 'WHO-UMC',
      expectednessAssessment: assessmentPayload.expeditedReportingRequired ? 'Unexpected / Unlisted' : 'Expected / Listed',
      seriousnessConfirmed: !currentReport.seriousness?.noneOfTheAbove,
      followUpRequired: false,
      caseStatus: currentReport.status,
      internalNotes: assessmentPayload.rationale,
      actionTaken: assessmentPayload.expeditedReportingRequired ? 'Flagged for 15-Day Expedited Regulatory Submission' : 'Routine Surveillance',
    };

    return this.saveAssessment(reportId, updatedAssessment);
  },

  // Update Report Status
  async updateReportStatus(reportId: string, newStatus: ReportStatus, comment?: string): Promise<{ success: boolean; data: AdverseEventReport; error?: string }> {
    const currentReport = await this.getReport(reportId);
    const existing = currentReport.assessment || ({} as PVAssessment);
    const updatedAssessment: PVAssessment = {
      ...existing,
      reviewerId: 'user_reviewer',
      reviewerName: 'Dr. Sarah Collins, PharmD',
      reviewDate: new Date().toISOString(),
      caseStatus: newStatus,
      reviewerComments: comment ? `${existing.reviewerComments || ''} [Status change note: ${comment}]` : (existing.reviewerComments || ''),
      causalityAssessment: existing.causalityAssessment || 'Possible',
      causalityScale: existing.causalityScale || 'WHO-UMC',
      expectednessAssessment: existing.expectednessAssessment || 'Expected / Listed',
      seriousnessConfirmed: !currentReport.seriousness?.noneOfTheAbove,
      followUpRequired: newStatus === 'Additional Information Requested',
      medicalAssessment: existing.medicalAssessment || '',
    };

    return this.saveAssessment(reportId, updatedAssessment);
  },

  // Request Follow-up
  async requestFollowUp(reportId: string, requestMessage: string, reviewer?: User): Promise<{ success: boolean; data: AdverseEventReport; error?: string }> {
    const res = await fetch(`/api/reports/${reportId}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestMessage, reviewer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, data: {} as any, error: err.error || 'Failed to send follow-up' };
    }
    const data = await res.json();
    return { success: true, data: data.report };
  },

  // Alias for requestFollowUp
  async addFollowUpQuery(reportId: string, requestMessage: string) {
    return this.requestFollowUp(reportId, requestMessage);
  },

  // Reply to Follow-up
  async replyFollowUp(reportId: string, followUpId: string, responseMessage: string, responderName: string): Promise<{ success: boolean; data: AdverseEventReport; error?: string }> {
    const res = await fetch(`/api/reports/${reportId}/follow-up-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followUpId, responseMessage, responderName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, data: {} as any, error: err.error || 'Failed to reply to follow-up' };
    }
    const data = await res.json();
    return { success: true, data: data.report };
  },

  // Alias for replyFollowUp
  async respondToQuery(reportId: string, followUpId: string, responseMessage: string, responderName: string) {
    return this.replyFollowUp(reportId, followUpId, responseMessage, responderName);
  },

  // Get E2B(R3) export
  async getE2BR3(reportId: string): Promise<{ xml: string; json: any; referenceNumber: string }> {
    const res = await fetch(`/api/reports/${reportId}/e2br3`);
    if (!res.ok) throw new Error('Failed to export E2B(R3) data');
    return res.json();
  },

  // Export E2B
  async exportE2B(reportId: string, format: 'xml' | 'json'): Promise<{ success: boolean; data: { content: string; filename: string } }> {
    const data = await this.getE2BR3(reportId);
    if (format === 'xml') {
      return {
        success: true,
        data: {
          content: data.xml,
          filename: `${data.referenceNumber}_E2BR3.xml`,
        },
      };
    } else {
      return {
        success: true,
        data: {
          content: JSON.stringify(data.json, null, 2),
          filename: `${data.referenceNumber}_E2BR3.json`,
        },
      };
    }
  },

  // Audit Logs
  async getAuditLogs(reportIdFilter?: string): Promise<{ success: boolean; data: AuditLog[] }> {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    const data = await res.json();
    let logs: AuditLog[] = data.logs || [];
    if (reportIdFilter) {
      logs = logs.filter((l) => l.reportId === reportIdFilter || l.reportRef === reportIdFilter);
    }
    return { success: true, data: logs };
  },

  // Users
  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.users;
  },
};
