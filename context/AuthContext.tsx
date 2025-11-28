
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, verifyCredentials, addUser } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'patient' | 'doctor', phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const authenticatedUser = verifyCredentials(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: 'patient' | 'doctor', phone: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser: User = {
          id: `u_${Date.now()}`,
          name,
          email,
          role,
          status: 'active',
          phone
      };
      
      addUser(newUser, password);
      setUser(newUser);
      return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
