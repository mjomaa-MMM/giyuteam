import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Shield } from 'lucide-react';
import { format } from 'date-fns';

const UserPanel = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          My Profile
        </CardTitle>
        <CardDescription>Your account information and subscription details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Username</span>
            <span className="text-sm font-semibold">{user.username}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Role</span>
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="gap-1">
              <Shield className="h-3 w-3" />
              {user.role}
            </Badge>
          </div>
          
          {user.is_subscribed && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Subscription Status</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              
              {user.subscription_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Started On</span>
                  <span className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(user.subscription_date), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
              
              {user.next_bill_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Next Billing</span>
                  <span className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(user.next_bill_date), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </>
          )}
          
          {!user.is_subscribed && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Subscription Status</span>
              <Badge variant="outline">Not Subscribed</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPanel;
