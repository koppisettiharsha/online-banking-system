import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const signIn = useCallback(async (email: string, password: string) => {
    // In a real app, this would make an API call to verify credentials
    if (email && password) {
      // Use the first part of the email as the name, capitalized
      const namePart = email.split('@')[0];
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      setUser({
        id: '1',
        name: name,
        email: email
      });
      setIsAuthenticated(true);
      navigate('/');
    }
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    // In a real app, this would make an API call to create a new user
    if (email && password && name) {
      setUser({
        id: '1',
        name: name,
        email: email
      });
      setIsAuthenticated(true);
      navigate('/');
    }
  }, [navigate]);

  const signOut = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    navigate('/signin');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}