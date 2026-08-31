import { useState } from 'react';

/**
 * Pharmacovigilance Patient Support & Helpdesk Configuration
 * Fixed, non-editable contact details.
 */

export interface SupportConfig {
  phoneNumber: string;
  phoneDisplay: string;
  emailAddress: string;
  emailDisplay: string;
  workingHours: string;
  urgentTriageNote: string;
}

// Fixed Patient Support details
export const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  phoneNumber: '+916295234084',
  phoneDisplay: '+91 6295234084',
  emailAddress: 'arijitkhanrah10@gmail.com',
  emailDisplay: 'arijitkhanrah10@gmail.com',
  workingHours: 'Every day, 10:00 AM – 10:00 PM',
  urgentTriageNote: '24/7 Urgent Adverse Event Intake & Emergency Triage Guidance',
};

export const isSupportConfigured = (_config?: SupportConfig): boolean => {
  return true;
};

export const getSupportConfig = (): SupportConfig => {
  return DEFAULT_SUPPORT_CONFIG;
};

export const useSupportConfig = () => {
  const [config] = useState<SupportConfig>(DEFAULT_SUPPORT_CONFIG);

  return {
    config,
    isConfigured: true,
  };
};

