
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@tradehub.com',
    password: 'admin123',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@tradehub.com',
    password: 'user123',
    avatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0EA5E9&color=fff',
    role: 'user' as UserRole
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tradehub-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const login = async (email: string, password: string) => {
    // Simulate API request
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('tradehub-user', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API request
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error('Email already in use'));
        } else {
          const newUser = {
            id: `${mockUsers.length + 1}`,
            name,
            email,
            avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0EA5E9&color=fff`,
            role: 'user' as UserRole
          };
          
          // In a real app, we would save to backend
          // For demo, we'll just set the current user
          setUser(newUser);
          localStorage.setItem('tradehub-user', JSON.stringify(newUser));
          resolve();
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tradehub-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, register }}>
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
