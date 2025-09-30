import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  isSubscribed?: boolean;
  subscriptionDate?: string;
  nextBillDate?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (username: string, password: string) => boolean;
  toggleSubscription: (userId: string) => void;
  setTestNotification: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin and user storage
const DEFAULT_ADMIN = {
  id: '1',
  username: 'admin',
  password: 'ADMIN',
  role: 'admin' as const
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize with admin user
  useEffect(() => {
    const storedUsers = localStorage.getItem('dojoUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers([{ id: DEFAULT_ADMIN.id, username: DEFAULT_ADMIN.username, role: DEFAULT_ADMIN.role }]);
    }

    // Check for existing session
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  // Update localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('dojoUsers', JSON.stringify(users));
    }
  }, [users]);

  const login = (username: string, password: string): boolean => {
    // Check admin credentials
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const adminUser = { id: '1', username: 'admin', role: 'admin' as const };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    // Check stored user credentials
    const storedPasswords = localStorage.getItem('userPasswords') || '{}';
    const passwords = JSON.parse(storedPasswords);
    
    const foundUser = users.find(u => u.username === username && u.role === 'user');
    if (foundUser && passwords[username] === password) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = (username: string, password: string): boolean => {
    // Check if username already exists
    if (users.some(u => u.username === username) || username === 'admin') {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      role: 'user'
    };

    setUsers(prev => [...prev, newUser]);
    
    // Store password separately (in a real app, this would be hashed and stored securely)
    const storedPasswords = localStorage.getItem('userPasswords') || '{}';
    const passwords = JSON.parse(storedPasswords);
    passwords[username] = password;
    localStorage.setItem('userPasswords', JSON.stringify(passwords));

    return true;
  };

  const toggleSubscription = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        
        const updatedUser = {
          ...u,
          isSubscribed: !u.isSubscribed,
          subscriptionDate: !u.isSubscribed ? now.toISOString().split('T')[0] : undefined,
          nextBillDate: !u.isSubscribed ? nextMonth.toISOString().split('T')[0] : undefined
        };
        
        // Update current user if it's the same user
        if (user && user.id === userId) {
          setUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        return updatedUser;
      }
      return u;
    }));
  };

  const setTestNotification = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const today = new Date();
        const testBillDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
        
        const updatedUser = {
          ...u,
          isSubscribed: true,
          subscriptionDate: u.subscriptionDate || today.toISOString().split('T')[0],
          nextBillDate: testBillDate.toISOString().split('T')[0]
        };
        
        // Update current user if it's the same user
        if (user && user.id === userId) {
          setUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        return updatedUser;
      }
      return u;
    }));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, addUser, toggleSubscription, setTestNotification }}>
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