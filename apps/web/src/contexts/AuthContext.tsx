'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, SessionProvider, signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/user';

interface ExtendedUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string;
  organizationId?: string;
  organization?: any;
}

interface AuthContextType {
  user: ExtendedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthProviderProps) => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;

  const user: ExtendedUser | null = session?.user ? {
    id: (session.user as any).id || '',
    email: session.user.email || '',
    name: session.user.name,
    image: session.user.image,
    role: (session.user as any).role,
    organizationId: (session.user as any).organizationId,
    organization: (session.user as any).organization,
  } : null;

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          error: result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error,
        };
      }

      return {
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      // First register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Registration failed',
        };
      }

      // Auto-login after successful registration
      const loginResult = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (loginResult?.error) {
        return {
          success: true,
          message: 'Registration successful. Please log in.',
        };
      }

      return {
        success: true,
        message: 'Registration and login successful',
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  const logout = async (): Promise<void> => {
    await signOut({ redirect: false });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    session,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <SessionProvider>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </SessionProvider>
  );
};
