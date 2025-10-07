import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  user_id: string;
  username: string;
  role: 'admin' | 'user';
  is_subscribed?: boolean;
  subscription_date?: string;
  next_bill_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (username: string, password: string) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  toggleSubscription: (userId: string) => Promise<void>;
  setTestNotification: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'ADMIN',
  role: 'admin' as const
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize and load users from database
  useEffect(() => {
    loadUsers();
    setupRealtimeSubscription();
    checkExistingSession();
  }, []);

  const loadUsers = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) return;

      const { data, error } = await supabase.functions.invoke('auth-get-users', {
        body: { sessionToken }
      });

      if (error) {
        console.error('Error loading users:', error);
        return;
      }

      if (data?.success && data?.users) {
        setUsers(data.users.map((user: any) => ({ ...user, role: user.role as 'admin' | 'user' })));
        
        // Create admin user if no users exist
        if (data.users.length === 0) {
          await createDefaultAdmin();
        }
      }
    } catch (error) {
      console.error('Error in loadUsers:', error);
    }
  };

  const createDefaultAdmin = async () => {
    // Admin creation is now handled by first login
    // This function is no longer needed but kept for compatibility
    console.log('Default admin creation is now handled during login');
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          // Reload users when any change occurs
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const checkExistingSession = async () => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) return;

    try {
      const { data, error } = await supabase.functions.invoke('auth-verify-session', {
        body: { sessionToken }
      });

      if (error || !data?.success) {
        // Session is invalid or expired, clear it
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('currentUser');
        return;
      }

      if (data?.user) {
        const typedUser = { ...data.user, role: data.user.role as 'admin' | 'user' };
        setUser(typedUser);
        localStorage.setItem('currentUser', JSON.stringify(typedUser));
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('currentUser');
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-login', {
        body: { username, password }
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data?.success && data?.user && data?.sessionToken) {
        const typedUser = { ...data.user, role: data.user.role as 'admin' | 'user' };
        setUser(typedUser);
        localStorage.setItem('sessionToken', data.sessionToken);
        localStorage.setItem('currentUser', JSON.stringify(typedUser));
        // Load users list if admin
        if (typedUser.role === 'admin') {
          await loadUsers();
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
  };

  const addUser = async (username: string, password: string): Promise<boolean> => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('auth-add-user', {
        body: { username, password, sessionToken }
      });

      if (error) {
        console.error('Error adding user:', error);
        return false;
      }

      return data?.success || false;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('auth-update-user', {
        body: { userId, updates, sessionToken }
      });

      if (error) {
        console.error('Error updating user:', error);
        return false;
      }

      // Update current user if it's the same user
      if (user && user.user_id === userId) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      return data?.success || false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('auth-delete-user', {
        body: { userId, sessionToken }
      });

      if (error) {
        console.error('Error deleting user:', error);
        return false;
      }

      return data?.success || false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const toggleSubscription = async (userId: string): Promise<void> => {
    try {
      const userToUpdate = users.find(u => u.user_id === userId);
      if (!userToUpdate) return;

      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      const updates = {
        is_subscribed: !userToUpdate.is_subscribed,
        subscription_date: !userToUpdate.is_subscribed ? now.toISOString().split('T')[0] : null,
        next_bill_date: !userToUpdate.is_subscribed ? nextMonth.toISOString().split('T')[0] : null
      };

      await updateUser(userId, updates);
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const setTestNotification = async (userId: string): Promise<void> => {
    try {
      const today = new Date();
      const testBillDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);

      const updates = {
        is_subscribed: true,
        subscription_date: users.find(u => u.user_id === userId)?.subscription_date || today.toISOString().split('T')[0],
        next_bill_date: testBillDate.toISOString().split('T')[0]
      };

      await updateUser(userId, updates);
    } catch (error) {
      console.error('Error setting test notification:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      addUser, 
      updateUser,
      deleteUser,
      toggleSubscription, 
      setTestNotification 
    }}>
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