import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateAvatar: (newAvatarUrl: string) => void;
  updateProfile: (name: string, avatar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock user data
const initialMockUsers = [
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
  const [mockUsers, setMockUsers] = useState<Array<typeof initialMockUsers[0]>>([]);
  
  // Load mock users and current user from localStorage on mount
  useEffect(() => {
    // Load saved users
    const savedUsers = localStorage.getItem('tradehub-users');
    if (savedUsers) {
      setMockUsers(JSON.parse(savedUsers));
    } else {
      setMockUsers(initialMockUsers);
      localStorage.setItem('tradehub-users', JSON.stringify(initialMockUsers));
    }
    
    // Load current user
    const storedUser = localStorage.getItem('tradehub-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const login = async (email: string, password: string) => {
    // Get the latest users from localStorage
    const storedUsers = localStorage.getItem('tradehub-users');
    const currentUsers = storedUsers ? JSON.parse(storedUsers) : mockUsers;
    
    // Simulate API request
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = currentUsers.find(
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
    // Get the latest users from localStorage
    const storedUsers = localStorage.getItem('tradehub-users');
    const currentUsers = storedUsers ? JSON.parse(storedUsers) : mockUsers;
    
    // Simulate API request
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = currentUsers.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error('Email already in use'));
        } else {
          const newUser = {
            id: `${currentUsers.length + 1}`,
            name,
            email,
            password, // Store password for mock auth
            avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0EA5E9&color=fff`,
            role: 'user' as UserRole
          };
          
          // Add to mock users array
          const updatedUsers = [...currentUsers, newUser];
          setMockUsers(updatedUsers);
          
          // Save to localStorage
          localStorage.setItem('tradehub-users', JSON.stringify(updatedUsers));
          
          // Log in the user (without password in the state)
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          localStorage.setItem('tradehub-user', JSON.stringify(userWithoutPassword));
          resolve();
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tradehub-user');
  };

  const updateAvatar = (newAvatarUrl: string) => {
    if (!user) return;
    
    // Update current user
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    localStorage.setItem('tradehub-user', JSON.stringify(updatedUser));
    
    // Update in mock users array
    const updatedMockUsers = mockUsers.map(mockUser => 
      mockUser.id === user.id ? { ...mockUser, avatar: newAvatarUrl } : mockUser
    );
    setMockUsers(updatedMockUsers);
    localStorage.setItem('tradehub-users', JSON.stringify(updatedMockUsers));
  };

  const updateProfile = (name: string, avatar: string) => {
    if (!user) return;
    
    // Update current user
    const updatedUser = { ...user, name, avatar };
    setUser(updatedUser);
    localStorage.setItem('tradehub-user', JSON.stringify(updatedUser));
    
    // Update in mock users array
    const updatedMockUsers = mockUsers.map(mockUser => 
      mockUser.id === user.id ? { ...mockUser, name, avatar } : mockUser
    );
    setMockUsers(updatedMockUsers);
    localStorage.setItem('tradehub-users', JSON.stringify(updatedMockUsers));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      login, 
      logout, 
      register, 
      updateAvatar,
      updateProfile 
    }}>
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
