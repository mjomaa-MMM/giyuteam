import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Users, Plus, CreditCard, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { user, users, logout, addUser, toggleSubscription, setTestNotification } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/welcome" replace />;
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || !newPassword) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    if (newUsername.length < 3) {
      toast({
        title: "Error",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "Error",
        description: "Password must be at least 4 characters long",
        variant: "destructive",
      });
      return;
    }

    const success = addUser(newUsername, newPassword);
    
    if (success) {
      toast({
        title: "Success",
        description: `User "${newUsername}" has been created successfully`,
      });
      setNewUsername('');
      setNewPassword('');
    } else {
      toast({
        title: "Error",
        description: "Username already exists. Please choose a different one.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleTestNotification = (userId: string, username: string) => {
    setTestNotification(userId);
    toast({
      title: "Test Notification Set",
      description: `User "${username}" will now see subscription expiry notification when they log in.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dojo-black">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.username}</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Add New User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New User
            </CardTitle>
            <CardDescription>
              Create a new user account for the dojo system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newUsername">Username</Label>
                  <Input
                    id="newUsername"
                    type="text"
                    placeholder="Enter username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="bg-dojo-red hover:bg-dojo-red-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({users.length})
            </CardTitle>
            <CardDescription>
              Manage all users in the dojo system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((userData) => (
                <div
                  key={userData.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dojo-red flex items-center justify-center text-white text-sm font-bold">
                      {userData.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{userData.username}</p>
                      <p className="text-sm text-muted-foreground">ID: {userData.id}</p>
                      {userData.isSubscribed && (
                        <div className="text-xs text-green-600">
                          <p>Subscribed: {userData.subscriptionDate}</p>
                          <p>Next bill: {userData.nextBillDate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {userData.role !== 'admin' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                          onClick={() => handleTestNotification(userData.id, userData.username)}
                        >
                          <Bell className="h-4 w-4 mr-1" />
                          Test Notification
                        </Button>
                        <Button
                          size="sm"
                          variant={userData.isSubscribed ? "destructive" : "default"}
                          className={userData.isSubscribed ? "" : "bg-dojo-red hover:bg-dojo-red-dark"}
                          onClick={() => toggleSubscription(userData.id)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          {userData.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      </>
                    )}
                    <Badge 
                      variant={userData.role === 'admin' ? 'default' : 'secondary'}
                      className={userData.role === 'admin' ? 'bg-dojo-red' : ''}
                    >
                      {userData.role}
                    </Badge>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No users found. Create your first user above.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;