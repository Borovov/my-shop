import React, { useState, useContext, createContext, useCallback, useEffect, type ReactNode } from 'react';
import type { LoginFormData, RegisterFormData } from '../types/auth';
import type { User, UserUpdateData, Address } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserUpdateData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const generateMockAddress = (id: string, isDefault: boolean = false): Address => ({
  id,
  isDefault,
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  zipCode: '10001'
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: data.email,
        role: 'user',
        phone: '+1234567890',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maxim',
        addresses: [
          generateMockAddress('1', true),
          {
            id: '2',
            isDefault: false,
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            zipCode: '90001'
          }
        ],
        preferences: {
          newsletter: true,
          notifications: {
            email: true,
            push: true
          }
        }
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: '1',
        name: data.name,
        email: data.email,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        addresses: [generateMockAddress('1', true)],
        preferences: {
          newsletter: true,
          notifications: {
            email: true,
            push: true
          }
        }
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Email may already be taken.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UserUpdateData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (user) {
        // Убедимся, что у пользователя всегда есть хотя бы один адрес по умолчанию
        const addresses = data.addresses ? data.addresses.map((addr, index) => ({
          ...addr,
          isDefault: addr.isDefault || (index === 0 && !data.addresses?.some(a => a.isDefault))
        })) : undefined;

        const updatedUser: User = {
          ...user,
          ...data,
          // Сохраняем обязательные поля
          id: user.id,
          email: user.email,
          role: user.role,
          // Обновляем адреса
          addresses: addresses || user.addresses,
          // Обновляем настройки
          preferences: data.preferences ? {
            newsletter: data.preferences.newsletter ?? user.preferences?.newsletter ?? false,
            notifications: {
              email: data.preferences.notifications?.email ?? user.preferences?.notifications?.email ?? false,
              push: data.preferences.notifications?.push ?? user.preferences?.notifications?.push ?? false
            }
          } : user.preferences
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 