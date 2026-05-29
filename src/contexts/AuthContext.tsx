import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, Permission, hasPermission as checkPermission, getPermissions } from '../config/permissions';
import axios from 'axios';

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export type { UserRole } from '../config/permissions';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: Permission) => boolean;
  getPermissions: () => Permission[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost/projects/inventory-management/public/api/admin';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('inventory_user');
    const token = localStorage.getItem('token');
    if (storedUser && token && !isTokenExpired(token)) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('inventory_user');
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('inventory_user');
      localStorage.removeItem('token');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, userData } = res.data.data;
      const roleMap: Record<string, UserRole> = {
        'super-admin': 'Admin',
        'admin': 'Admin',
        'manager': 'Manager',
        'staff': 'Staff',
        'user': 'Staff',
      };
      const loggedInUser: User = {
        id: String(userData.id),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: roleMap[userData.role?.toLowerCase()] || 'Staff',
        avatar: userData.image
          ? `http://localhost/projects/inventory-management/public/storage/${userData.image}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=dc3545&color=fff`,
        image: userData.image || '',
      };
      setUser(loggedInUser);
      localStorage.setItem('inventory_user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventory_user');
    localStorage.removeItem('token');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('inventory_user', JSON.stringify(updated));
      return updated;
    });
  };

  const hasPermissionForUser = (permission: Permission): boolean => {
    if (!user) return false;
    return checkPermission(user.role, permission);
  };

  const getPermissionsForUser = (): Permission[] => {
    if (!user) return [];
    return getPermissions(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'Admin',
        isManager: user?.role === 'Manager',
        isStaff: user?.role === 'Staff',
        login,
        logout,
        updateUser,
        hasPermission: hasPermissionForUser,
        getPermissions: getPermissionsForUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
