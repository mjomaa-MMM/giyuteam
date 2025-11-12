import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Users, Plus, CreditCard, Bell, Trash2, Edit, Newspaper, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const { user, users, logout, addUser, updateUser, deleteUser, toggleSubscription, setTestNotification } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleAddUser = async (e: React.FormEvent) => {
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

    const success = await addUser(newUsername, newPassword);
    
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

  const handleTestNotification = async (userId: string, username: string) => {
    await setTestNotification(userId);
    toast({
      title: "Test Notification Set",
      description: `User "${username}" will now see subscription expiry notification when they log in.`,
    });
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast({
        title: "User Deleted",
        description: `User "${username}" has been deleted successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (userId: string, currentUsername: string) => {
    setEditingUser(userId);
    setEditUsername(currentUsername);
  };

  const handleUpdateUser = async (userId: string) => {
    if (!editUsername || editUsername.length < 3) {
      toast({
        title: "Error",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    const success = await updateUser(userId, { username: editUsername });
    if (success) {
      toast({
        title: "User Updated",
        description: "Username has been updated successfully",
      });
      setEditingUser(null);
      setEditUsername('');
    } else {
      toast({
        title: "Error",
        description: "Failed to update user or username already exists",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditUsername('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dojo-black">Subscribers Management</h1>
            <p className="text-muted-foreground">Welcome back, {user.username}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/admin/content')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Edit Content
            </Button>
            <Button 
              onClick={() => navigate('/admin/news')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Newspaper className="h-4 w-4" />
              Manage News
            </Button>
            <Button 
              onClick={() => navigate('/admin/schedule')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Manage Schedule
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
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
                    <div className="flex-1">
                      {editingUser === userData.user_id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            className="max-w-40"
                            placeholder="Username"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleUpdateUser(userData.user_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{userData.username}</p>
                          <p className="text-sm text-muted-foreground">ID: {userData.user_id}</p>
                          {userData.is_subscribed && (
                            <div className="text-xs text-green-600">
                              <p>Subscribed: {userData.subscription_date}</p>
                              <p>Next bill: {userData.next_bill_date}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {userData.role !== 'admin' && editingUser !== userData.user_id && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          onClick={() => handleEditUser(userData.user_id, userData.username)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleDeleteUser(userData.user_id, userData.username)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                          onClick={() => handleTestNotification(userData.user_id, userData.username)}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={userData.is_subscribed ? "destructive" : "default"}
                          className={userData.is_subscribed ? "" : "bg-dojo-red hover:bg-dojo-red-dark"}
                          onClick={() => toggleSubscription(userData.user_id)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          {userData.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
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