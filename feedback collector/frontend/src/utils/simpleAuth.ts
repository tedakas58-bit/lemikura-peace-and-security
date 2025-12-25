/**
 * Simple authentication system that doesn't rely on Supabase Auth
 * This is a temporary solution until Supabase Auth is properly configured
 */

const ADMIN_CREDENTIALS_KEY = 'admin_credentials';
const ADMIN_SESSION_KEY = 'admin_session';

export interface AdminCredentials {
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AdminSession {
  email: string;
  loginTime: string;
  expiresAt: string;
}

// Simple hash function (not cryptographically secure, but sufficient for demo)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const createAdminAccount = (email: string, password: string): { success: boolean; error?: string } => {
  try {
    // Check if admin already exists
    const existing = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (existing) {
      return { success: false, error: 'Admin account already exists' };
    }

    // Validate inputs
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Create admin credentials
    const credentials: AdminCredentials = {
      email,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials));
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create admin account' };
  }
};

export const signInAdmin = (email: string, password: string): { success: boolean; error?: string } => {
  try {
    const credentialsStr = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!credentialsStr) {
      return { success: false, error: 'No admin account found. Please run setup first.' };
    }

    const credentials: AdminCredentials = JSON.parse(credentialsStr);
    
    if (credentials.email !== email || credentials.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create session (expires in 24 hours)
    const session: AdminSession = {
      email,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Sign in failed' };
  }
};

export const signOutAdmin = (): void => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const getCurrentAdminSession = (): AdminSession | null => {
  try {
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionStr) return null;

    const session: AdminSession = JSON.parse(sessionStr);
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
};

export const isAdminLoggedIn = (): boolean => {
  return getCurrentAdminSession() !== null;
};

export const hasAdminAccount = (): boolean => {
  return localStorage.getItem(ADMIN_CREDENTIALS_KEY) !== null;
};