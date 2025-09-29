import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Home } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Redirect if not logged in or is admin
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const goToMainSite = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dojo-black">User Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.username}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={goToMainSite}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Main Site
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

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile
            </CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-dojo-red flex items-center justify-center text-white text-xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.username}</h3>
                <p className="text-muted-foreground">Role: {user.role}</p>
                <p className="text-muted-foreground">User ID: {user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access dojo features and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={goToMainSite}
                variant="outline"
                className="h-20 flex flex-col items-center gap-2"
              >
                <Home className="h-6 w-6" />
                <span>Visit Dojo Website</span>
              </Button>
              <Button 
                variant="outline"
                className="h-20 flex flex-col items-center gap-2"
                disabled
              >
                <User className="h-6 w-6" />
                <span>My Classes (Soon)</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-dojo-red/10 to-dojo-red-light/10 border-dojo-red/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-dojo-black mb-2">
                Welcome to Giyu Dojo!
              </h3>
              <p className="text-muted-foreground">
                You are successfully logged in as a user. More features will be added soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;