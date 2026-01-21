import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, Permission, hasPermission as checkPermission, getPermissions } from '../config/permissions';

export type { UserRole } from '../config/permissions';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  getPermissions: () => Permission[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@inventory.com',
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@inventory.com',
      role: 'Admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=dc3545&color=fff'
    }
  },
  {
    email: 'manager@inventory.com',
    password: 'manager123',
    user: {
      id: '2',
      name: 'Manager User',
      email: 'manager@inventory.com',
      role: 'Manager',
      avatar: 'https://ui-avatars.com/api/?name=Manager+User&background=ffc107&color=000'
    }
  },
  {
    email: 'staff@inventory.com',
    password: 'staff123',
    user: {
      id: '3',
      name: 'Staff Member',
      email: 'staff@inventory.com',
      role: 'Staff',
      avatar: 'https://ui-avatars.com/api/?name=Staff+Member&background=0dcaf0&color=fff'
    }
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('inventory_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('inventory_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const found = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (found) {
      setUser(found.user);
      localStorage.setItem('inventory_user', JSON.stringify(found.user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventory_user');
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
        isAdmin: user?.role === 'Admin',
        isManager: user?.role === 'Manager',
        isStaff: user?.role === 'Staff',
        login, 
        logout,
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
