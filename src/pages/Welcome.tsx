import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import dojoLogo from '@/assets/giyu-team-logo.png';

const Welcome = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/subscribers' : '/site'} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    
    if (success) {
      toast({
        title: "Welcome!",
        description: "You have successfully logged in",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="text-center space-y-4 pb-2">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 p-2 ring-2 ring-primary/20">
              <img 
                src={dojoLogo} 
                alt="Giyu Dojo Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
              Welcome to Giyu Dojo
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access the dojo system
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground/90 font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full h-11 border-border/60 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200"
            onClick={() => navigate('/site')}
            disabled={isLoading}
          >
            Continue as Guest
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
