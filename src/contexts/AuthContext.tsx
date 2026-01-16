import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2e3192&color=fff'
    }
  },
  {
    email: 'staff@inventory.com',
    password: 'staff123',
    user: {
      id: '2',
      name: 'Staff Member',
      email: 'staff@inventory.com',
      role: 'staff',
      avatar: 'https://ui-avatars.com/api/?name=Staff+Member&background=22c55e&color=fff'
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

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isAdmin: user?.role === 'admin',
        login, 
        logout 
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
