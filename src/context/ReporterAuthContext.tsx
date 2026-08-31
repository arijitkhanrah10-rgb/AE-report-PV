import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ReporterProfile,
  getLoggedInReporter,
  setLoggedInReporter,
  registerReporter,
  loginReporterWithPhone,
  logoutReporter,
  updateReporterProfile,
  getRegisteredReporters,
} from '../services/reporterAuth';

interface ReporterAuthContextType {
  reporter: ReporterProfile | null;
  isLoggedIn: boolean;
  registeredReporters: ReporterProfile[];
  login: (phone: string, countryCode?: string) => { success: boolean; reporter?: ReporterProfile; error?: string };
  register: (data: Omit<ReporterProfile, 'id' | 'registeredAt' | 'lastLoginAt' | 'phoneNormalized'>) => ReporterProfile;
  logout: () => void;
  updateProfile: (updates: Partial<ReporterProfile>) => ReporterProfile | null;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openProfileModal: () => void;
  closeAuthModals: () => void;
  activeAuthModal: 'login' | 'register' | 'profile' | null;
}

const ReporterAuthContext = createContext<ReporterAuthContextType | undefined>(undefined);

export const ReporterAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reporter, setReporter] = useState<ReporterProfile | null>(() => getLoggedInReporter());
  const [registeredReporters, setRegisteredReporters] = useState<ReporterProfile[]>(() => getRegisteredReporters());
  const [activeAuthModal, setActiveAuthModal] = useState<'login' | 'register' | 'profile' | null>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setReporter(getLoggedInReporter());
      setRegisteredReporters(getRegisteredReporters());
    };

    window.addEventListener('reporter-auth-changed', handleAuthChange);
    return () => window.removeEventListener('reporter-auth-changed', handleAuthChange);
  }, []);

  const login = (phone: string, countryCode?: string) => {
    const result = loginReporterWithPhone(phone, countryCode);
    if (result.success && result.reporter) {
      setReporter(result.reporter);
      setActiveAuthModal(null);
    }
    return result;
  };

  const register = (data: Omit<ReporterProfile, 'id' | 'registeredAt' | 'lastLoginAt' | 'phoneNormalized'>) => {
    const newProfile = registerReporter(data);
    setReporter(newProfile);
    setRegisteredReporters(getRegisteredReporters());
    setActiveAuthModal(null);
    return newProfile;
  };

  const logout = () => {
    logoutReporter();
    setReporter(null);
    setActiveAuthModal(null);
  };

  const updateProfileHandler = (updates: Partial<ReporterProfile>) => {
    const updated = updateReporterProfile(updates);
    if (updated) {
      setReporter(updated);
      setRegisteredReporters(getRegisteredReporters());
    }
    return updated;
  };

  return (
    <ReporterAuthContext.Provider
      value={{
        reporter,
        isLoggedIn: !!reporter,
        registeredReporters,
        login,
        register,
        logout,
        updateProfile: updateProfileHandler,
        openLoginModal: () => setActiveAuthModal('login'),
        openRegisterModal: () => setActiveAuthModal('register'),
        openProfileModal: () => setActiveAuthModal('profile'),
        closeAuthModals: () => setActiveAuthModal(null),
        activeAuthModal,
      }}
    >
      {children}
    </ReporterAuthContext.Provider>
  );
};

export const useReporterAuth = (): ReporterAuthContextType => {
  const context = useContext(ReporterAuthContext);
  if (!context) {
    throw new Error('useReporterAuth must be used within a ReporterAuthProvider');
  }
  return context;
};
