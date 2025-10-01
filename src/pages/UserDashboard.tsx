import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Home } from 'lucide-react';
import UserPanel from '@/components/UserPanel';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Check for subscription expiry notification
  useEffect(() => {
    if (user?.is_subscribed && user.next_bill_date) {
      const today = new Date();
      const billDate = new Date(user.next_bill_date);
      const diffTime = billDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 3) {
        toast({
          title: "Subscription Ending Soon",
          description: `Your subscription expires in 3 days (${user.next_bill_date}). Please renew to continue access.`,
          variant: "destructive",
        });
      }
    }
  }, [user, toast]);

  // Redirect if not logged in or is admin
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/subscribers" replace />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const goToMainSite = () => {
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* User Panel and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <UserPanel />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access dojo features and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={goToMainSite}
                className="w-full bg-dojo-red hover:bg-dojo-red-dark"
              >
                <Home className="h-4 w-4 mr-2" />
                Visit Dojo Website
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;