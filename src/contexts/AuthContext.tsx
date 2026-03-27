import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export interface SessionUser {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

interface RegisteredStorefrontUser extends SessionUser {
  password: string;
}

type StorefrontProvider = 'google' | 'apple' | 'phone';

interface AuthContextType {
  storefrontUser: SessionUser | null;
  adminUser: SessionUser | null;
  loginStorefront: (email: string, password: string) => { success: boolean; message?: string };
  registerStorefront: (
    name: string,
    email: string,
    password: string,
  ) => { success: boolean; message?: string };
  loginStorefrontWithProvider: (
    provider: StorefrontProvider,
    phoneNumber?: string,
  ) => { success: boolean; message?: string };
  loginAdmin: (email: string, password: string) => { success: boolean; message?: string };
  logoutStorefront: () => void;
  logoutAdmin: () => void;
  updateStorefrontProfile: (updates: Partial<SessionUser>) => void;
}

const STOREFRONT_AUTH_KEY = 'product-customizer-storefront-auth';
const ADMIN_AUTH_KEY = 'product-customizer-admin-auth';
const STOREFRONT_USERS_KEY = 'product-customizer-storefront-users';

const STOREFRONT_CREDENTIALS = {
  email: 'user@customizer.com',
  password: 'user123',
  name: 'Storefront User',
};

const ADMIN_CREDENTIALS = {
  email: 'admin@customizer.com',
  password: 'admin123',
  name: 'Admin Manager',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readSession(key: string): SessionUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^0-9+]/g, '');
}

function readRegisteredUsers() {
  return readSessionCollection(STOREFRONT_USERS_KEY);
}

function readSessionCollection(key: string): RegisteredStorefrontUser[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as RegisteredStorefrontUser[];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storefrontUser, setStorefrontUser] = useState<SessionUser | null>(() => readSession(STOREFRONT_AUTH_KEY));
  const [adminUser, setAdminUser] = useState<SessionUser | null>(() => readSession(ADMIN_AUTH_KEY));
  const [registeredStorefrontUsers, setRegisteredStorefrontUsers] = useState<RegisteredStorefrontUser[]>(() =>
    readRegisteredUsers(),
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STOREFRONT_AUTH_KEY) {
        setStorefrontUser(readSession(STOREFRONT_AUTH_KEY));
      }

      if (event.key === ADMIN_AUTH_KEY) {
        setAdminUser(readSession(ADMIN_AUTH_KEY));
      }

      if (event.key === STOREFRONT_USERS_KEY) {
        setRegisteredStorefrontUsers(readRegisteredUsers());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (storefrontUser) {
      window.localStorage.setItem(STOREFRONT_AUTH_KEY, JSON.stringify(storefrontUser));
    } else {
      window.localStorage.removeItem(STOREFRONT_AUTH_KEY);
    }
  }, [storefrontUser]);

  useEffect(() => {
    if (adminUser) {
      window.localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(adminUser));
    } else {
      window.localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }, [adminUser]);

  useEffect(() => {
    window.localStorage.setItem(STOREFRONT_USERS_KEY, JSON.stringify(registeredStorefrontUsers));
  }, [registeredStorefrontUsers]);

  const loginStorefront: AuthContextType['loginStorefront'] = (email, password) => {
    if (email === STOREFRONT_CREDENTIALS.email && password === STOREFRONT_CREDENTIALS.password) {
      setStorefrontUser({
        name: STOREFRONT_CREDENTIALS.name,
        email: STOREFRONT_CREDENTIALS.email,
      });
      return { success: true };
    }

    const registeredUser = registeredStorefrontUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    );

    if (registeredUser) {
      const { password: _password, ...sessionUser } = registeredUser;
      setStorefrontUser({
        ...sessionUser,
      });
      return { success: true };
    }

    return { success: false, message: 'Use your registered account or the storefront demo credentials to sign in.' };
  };

  const registerStorefront: AuthContextType['registerStorefront'] = (name, email, password) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return { success: false, message: 'Name, email, and password are required.' };
    }

    const emailAlreadyUsed =
      normalizedEmail === STOREFRONT_CREDENTIALS.email ||
      registeredStorefrontUsers.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (emailAlreadyUsed) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const nextUser: RegisteredStorefrontUser = {
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
    };

    setRegisteredStorefrontUsers((currentUsers) => [nextUser, ...currentUsers]);
    setStorefrontUser({
      name: nextUser.name,
      email: nextUser.email,
    });

    return { success: true };
  };

  const loginStorefrontWithProvider: AuthContextType['loginStorefrontWithProvider'] = (provider, phoneNumber) => {
    if (provider === 'google') {
      setStorefrontUser({
        name: 'Google Customer',
        email: 'customer@gmail.com',
      });
      return { success: true };
    }

    if (provider === 'apple') {
      setStorefrontUser({
        name: 'Apple Customer',
        email: 'customer@icloud.com',
      });
      return { success: true };
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber || '');

    if (normalizedPhone.length < 10) {
      return { success: false, message: 'Enter a valid phone number to continue.' };
    }

    setStorefrontUser({
      name: 'Phone Customer',
      email: `${normalizedPhone}@phone.demo`,
    });
    return { success: true };
  };

  const loginAdmin: AuthContextType['loginAdmin'] = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setAdminUser({
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
      });
      return { success: true };
    }

    return { success: false, message: 'Use the admin demo credentials to sign in.' };
  };

  const logoutStorefront = () => {
    setStorefrontUser(null);
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const updateStorefrontProfile = (updates: Partial<SessionUser>) => {
    if (!storefrontUser) return;
    const updatedUser = { ...storefrontUser, ...updates };
    setStorefrontUser(updatedUser);
    setRegisteredStorefrontUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.email.toLowerCase() === storefrontUser.email.toLowerCase()
          ? { ...user, ...updates }
          : user,
      ),
    );
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STOREFRONT_AUTH_KEY, JSON.stringify(updatedUser));
    }
  };

  const value = useMemo(
    () => ({
      storefrontUser,
      adminUser,
      loginStorefront,
      registerStorefront,
      loginStorefrontWithProvider,
      loginAdmin,
      logoutStorefront,
      logoutAdmin,
      updateStorefrontProfile,
    }),
    [adminUser, registeredStorefrontUsers, storefrontUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export const demoCredentials = {
  storefront: STOREFRONT_CREDENTIALS,
  admin: ADMIN_CREDENTIALS,
};
