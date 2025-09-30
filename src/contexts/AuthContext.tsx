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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading users:', error);
        return;
      }

      setUsers((data || []).map(user => ({ ...user, role: user.role as 'admin' | 'user' })));
      
      // Create admin user if no users exist
      if (!data || data.length === 0) {
        await createDefaultAdmin();
      }
    } catch (error) {
      console.error('Error in loadUsers:', error);
    }
  };

  const createDefaultAdmin = async () => {
    try {
      const adminUserId = crypto.randomUUID();
      
      // Insert admin profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: adminUserId,
          username: DEFAULT_ADMIN.username,
          role: DEFAULT_ADMIN.role
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return;
      }

      // Insert admin password
      const { error: passwordError } = await supabase
        .from('user_passwords')
        .insert({
          user_id: adminUserId,
          password_hash: DEFAULT_ADMIN.password // In production, this should be hashed
        });

      if (passwordError) {
        console.error('Error creating admin password:', passwordError);
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
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

  const checkExistingSession = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check admin credentials
      if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
        const { data: adminData } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', 'admin')
          .eq('role', 'admin')
          .single();

        if (adminData) {
          const typedUser = { ...adminData, role: adminData.role as 'admin' | 'user' };
          setUser(typedUser);
          localStorage.setItem('currentUser', JSON.stringify(typedUser));
          return true;
        }
      }

      // Check regular user credentials
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('role', 'user')
        .single();

      if (profileData) {
        const { data: passwordData } = await supabase
          .from('user_passwords')
          .select('password_hash')
          .eq('user_id', profileData.user_id)
          .single();

        if (passwordData && passwordData.password_hash === password) {
          const typedUser = { ...profileData, role: profileData.role as 'admin' | 'user' };
          setUser(typedUser);
          localStorage.setItem('currentUser', JSON.stringify(typedUser));
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser || username === 'admin') {
        return false;
      }

      const newUserId = crypto.randomUUID();

      // Insert new profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: newUserId,
          username,
          role: 'user'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return false;
      }

      // Insert password
      const { error: passwordError } = await supabase
        .from('user_passwords')
        .insert({
          user_id: newUserId,
          password_hash: password // In production, this should be hashed
        });

      if (passwordError) {
        console.error('Error creating password:', passwordError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

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

      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        return false;
      }

      return true;
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