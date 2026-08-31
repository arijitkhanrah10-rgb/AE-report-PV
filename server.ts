import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { pvDb, MOCK_USERS } from './server/db';
import { PVAssessment, User } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SafeMeds PV - Pharmacovigilance Platform API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Get current active users / switch accounts
  app.get('/api/users', (req, res) => {
    res.json({ success: true, users: pvDb.getUsers() });
  });

  app.post('/api/users', (req, res) => {
    const { name, email, role, organization, title } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }
    const user = pvDb.addUser({ name, email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@safemeds.demo`, role, organization: organization || 'SafeMeds PV', title: title || role });
    res.json({ success: true, user });
  });

  // Dashboard KPI statistics
  app.get('/api/stats', (req, res) => {
    const stats = pvDb.getDashboardStats();
    res.json({ success: true, stats });
  });

  // Get all reports with filtering & sorting
  app.get('/api/reports', (req, res) => {
    const { search, status, seriousness, outcome, reporterType, drug, sortBy = 'date', order = 'desc' } = req.query;
    let list = pvDb.getAllReports();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.referenceNumber.toLowerCase().includes(q) ||
        r.reporterInfo?.fullName?.toLowerCase().includes(q) ||
        r.patientInfo?.fullName?.toLowerCase().includes(q) ||
        r.adverseEvent?.reactionTerms?.toLowerCase().includes(q) ||
        r.adverseEvent?.description?.toLowerCase().includes(q) ||
        r.suspectedMedications?.some((m) => m.brandName.toLowerCase().includes(q) || m.genericName?.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }

    if (seriousness && seriousness !== 'all') {
      if (seriousness === 'serious') {
        list = list.filter((r) => !r.seriousness?.noneOfTheAbove);
      } else if (seriousness === 'non-serious') {
        list = list.filter((r) => r.seriousness?.noneOfTheAbove);
      }
    }

    if (outcome && outcome !== 'all') {
      list = list.filter((r) => r.adverseEvent?.outcome === outcome);
    }

    if (reporterType && reporterType !== 'all') {
      list = list.filter((r) => r.reporterType === reporterType);
    }

    if (drug && typeof drug === 'string' && drug !== 'all') {
      const d = drug.toLowerCase();
      list = list.filter((r) =>
        r.suspectedMedications?.some((m) => m.brandName.toLowerCase().includes(d) || m.genericName?.toLowerCase().includes(d))
      );
    }

    // Sort
    list.sort((a, b) => {
      const dateA = new Date(a.dateSubmitted || a.dateCreated).getTime();
      const dateB = new Date(b.dateSubmitted || b.dateCreated).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    res.json({ success: true, count: list.length, reports: list });
  });

  // Get specific report by ID or reference
  app.get('/api/reports/:id', (req, res) => {
    const report = pvDb.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Audit log case view
    const userId = (req.headers['x-user-id'] as string) || 'reviewer_session';
    const userName = (req.headers['x-user-name'] as string) || 'PV Reviewer';
    pvDb.addAuditLog({
      userId,
      userName,
      userRole: (req.headers['x-user-role'] as string) || 'pv_reviewer',
      action: 'Report Viewed',
      reportId: report.id,
      reportRef: report.referenceNumber,
      details: `Full clinical case dossier viewed for reference ${report.referenceNumber}.`,
    });

    res.json({ success: true, report });
  });

  // Create/Submit new Adverse Event Report
  app.post('/api/reports', (req, res) => {
    try {
      const reportData = req.body;
      const currentUser: User = {
        id: (req.headers['x-user-id'] as string) || 'reporter_client',
        name: (req.headers['x-user-name'] as string) || reportData.reporterInfo?.fullName || 'Reporter',
        email: reportData.reporterInfo?.email || '',
        role: 'reporter',
        organization: 'Self',
        title: 'Reporter',
      };

      const newReport = pvDb.createReport(reportData, currentUser);
      res.status(201).json({
        success: true,
        referenceNumber: newReport.referenceNumber,
        verificationCode: newReport.verificationCode,
        id: newReport.id,
        dateSubmitted: newReport.dateSubmitted,
        status: newReport.status,
        report: newReport,
      });
    } catch (err: any) {
      console.error('Error submitting report:', err);
      res.status(500).json({ error: 'Failed to submit adverse event report', message: err.message });
    }
  });

  // Update existing report (within 5-day window)
  app.put('/api/reports/:id', (req, res) => {
    try {
      const existing = pvDb.getReportById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Check 5-day edit period window (5 * 24 * 60 * 60 * 1000 ms)
      const submissionTime = new Date(existing.dateSubmitted || existing.dateCreated).getTime();
      const elapsedMs = Date.now() - submissionTime;
      const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

      if (elapsedMs > FIVE_DAYS_MS) {
        return res.status(403).json({
          error: 'Editing period expired — reports can only be viewed after 5 days.',
          isExpired: true,
        });
      }

      const currentUser: User = {
        id: (req.headers['x-user-id'] as string) || 'reporter_client',
        name: (req.headers['x-user-name'] as string) || req.body.reporterInfo?.fullName || 'Reporter',
        email: req.body.reporterInfo?.email || '',
        role: 'reporter',
        organization: 'Self',
        title: 'Reporter',
      };

      const updated = pvDb.updateReport(req.params.id, req.body, currentUser);
      res.json({
        success: true,
        report: updated,
        message: 'Report updated successfully.',
      });
    } catch (err: any) {
      console.error('Error updating report:', err);
      res.status(500).json({ error: 'Failed to update adverse event report', message: err.message });
    }
  });

  // Save or update draft
  app.post('/api/drafts', (req, res) => {
    try {
      const draftData = req.body;
      const currentUser: User = {
        id: (req.headers['x-user-id'] as string) || 'guest_draft',
        name: draftData.reporterInfo?.fullName || 'Draft User',
        email: draftData.reporterInfo?.email || '',
        role: 'reporter',
        organization: 'Self',
        title: 'Reporter',
      };

      const result = pvDb.saveDraft(draftData, currentUser);
      res.json({ success: true, ...result, message: 'Draft saved successfully.' });
    } catch (err: any) {
      console.error('Error saving draft:', err);
      res.status(500).json({ error: 'Failed to save draft', message: err.message });
    }
  });

  // Retrieve draft by reference or code
  app.get('/api/drafts/:ref', (req, res) => {
    const draft = pvDb.getDraftByRef(req.params.ref);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found with provided reference or code.' });
    }
    res.json({ success: true, draft });
  });

  // Public Report Status Verification lookup
  app.post('/api/reports/check-status', (req, res) => {
    const { referenceNumber, verificationQuery } = req.body;
    if (!referenceNumber || !verificationQuery) {
      return res.status(400).json({ error: 'Both Reference Number and Verification Info (Code/Email/Phone) are required.' });
    }

    const report = pvDb.findReportByVerification(referenceNumber, verificationQuery);
    if (!report) {
      return res.status(404).json({
        error: 'No report found matching this Reference Number and Verification identifier.',
      });
    }

    // Log status check query
    pvDb.addAuditLog({
      userId: 'public_status_check',
      userName: report.reporterInfo?.fullName || 'Reporter',
      userRole: 'reporter',
      action: 'Status Checked by Reporter',
      reportId: report.id,
      reportRef: report.referenceNumber,
      details: `Reporter queried status for reference ${report.referenceNumber}.`,
    });

    // Return safe public status representation (hiding deep internal PV notes from public, keeping follow-ups)
    res.json({
      success: true,
      referenceNumber: report.referenceNumber,
      dateSubmitted: report.dateSubmitted,
      status: report.status,
      lastUpdated: report.lastUpdated,
      suspectedMedications: report.suspectedMedications?.map((m) => ({ brandName: m.brandName, genericName: m.genericName })),
      adverseEvent: {
        reactionTerms: report.adverseEvent?.reactionTerms,
        severity: report.adverseEvent?.severity,
        outcome: report.adverseEvent?.outcome,
        startDate: report.adverseEvent?.startDate,
      },
      followUps: report.followUps,
      timeline: report.timeline,
      assignedReviewer: report.assignedReviewer || 'Assigned Pharmacovigilance Triage Team',
    });
  });

  // Save PV Reviewer Assessment
  app.put('/api/reports/:id/assessment', (req, res) => {
    const assessment: PVAssessment = req.body.assessment;
    const reviewer: User = req.body.reviewer || {
      id: 'user_reviewer',
      name: 'Dr. Sarah Collins, PharmD',
      email: 'sarah.collins@safemeds-pv.org',
      role: 'pv_reviewer',
      organization: 'Global Drug Safety & PV Unit',
      title: 'Senior Pharmacovigilance Specialist',
    };

    if (!assessment) {
      return res.status(400).json({ error: 'Assessment payload is required.' });
    }

    const updated = pvDb.updateAssessment(req.params.id, assessment, reviewer);
    if (!updated) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, report: updated, message: 'PV Assessment saved successfully.' });
  });

  // Reviewer requests follow-up information
  app.post('/api/reports/:id/follow-up', (req, res) => {
    const { requestMessage, reviewer } = req.body;
    if (!requestMessage) {
      return res.status(400).json({ error: 'Request message is required.' });
    }

    const currentReviewer: User = reviewer || {
      id: 'user_reviewer',
      name: 'Dr. Sarah Collins, PharmD',
      email: 'sarah.collins@safemeds-pv.org',
      role: 'pv_reviewer',
      organization: 'Global Drug Safety & PV Unit',
      title: 'Senior Pharmacovigilance Specialist',
    };

    const updated = pvDb.addFollowUpRequest(req.params.id, requestMessage, currentReviewer);
    if (!updated) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, report: updated, message: 'Follow-up request dispatched to reporter.' });
  });

  // Reporter replies to follow-up request
  app.post('/api/reports/:id/follow-up-reply', (req, res) => {
    const { followUpId, responseMessage, responderName } = req.body;
    if (!followUpId || !responseMessage) {
      return res.status(400).json({ error: 'FollowUpId and responseMessage are required.' });
    }

    const updated = pvDb.replyToFollowUp(req.params.id, followUpId, responseMessage, responderName || 'Reporter');
    if (!updated) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, report: updated, message: 'Response submitted successfully.' });
  });

  // E2B(R3) ICSR XML and JSON Export
  app.get('/api/reports/:id/e2br3', (req, res) => {
    const report = pvDb.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const xml = pvDb.generateE2BR3Xml(report);
    const jsonE2b = {
      messageHeader: {
        messageType: 'ichicsr',
        formatVersion: '2.1',
        release: '2.0',
        messageNumber: report.referenceNumber,
        senderIdentifier: 'SAFEMEDS-PV-SYSTEM',
        receiverIdentifier: 'REGULATORY-AUTHORITY-DEMO',
        date: new Date().toISOString(),
      },
      safetyReport: {
        safetyReportId: report.referenceNumber,
        reportType: 'Spontaneous',
        isSerious: !report.seriousness?.noneOfTheAbove,
        seriousnessCriteria: report.seriousness,
        patient: {
          initials: (report.patientInfo?.fullName || 'XX').split(' ').map((n) => n[0]).join('').toUpperCase(),
          age: report.patientInfo?.age,
          gender: report.patientInfo?.sex,
          weightKg: report.patientMeasurements?.weight,
          heightCm: report.patientMeasurements?.height,
        },
        suspectedDrugs: report.suspectedMedications,
        concomitantDrugs: report.concomitantMedications,
        reaction: {
          term: report.adverseEvent?.reactionTerms || report.adverseEvent?.description,
          startDate: report.adverseEvent?.startDate,
          outcome: report.adverseEvent?.outcome,
        },
        causalityAssessment: report.assessment?.causalityAssessment || 'Pending Assessment',
      },
    };

    if (req.query.format === 'xml') {
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename="${report.referenceNumber}_E2BR3.xml"`);
      return res.send(xml);
    }

    res.json({
      success: true,
      referenceNumber: report.referenceNumber,
      xml,
      json: jsonE2b,
    });
  });

  // System Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    const logs = pvDb.getAuditLogs();
    res.json({ success: true, logs });
  });

  // Vite middleware for development / static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SafeMeds PV] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SafeMeds PV server:', err);
});
