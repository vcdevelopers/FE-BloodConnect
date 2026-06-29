import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'admin@mumbaibloodconnect.org' && password === 'admin') {
      toast({
        title: "Login Successful",
        description: "Welcome to Mumbai Blood Connect Admin Console.",
      });
      localStorage.setItem('admin_token', 'true');
      navigate('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid email or password. Please use admin credentials to access the console.",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Passwords do not match.",
      });
      return;
    }
    toast({
      title: "Account Created",
      description: `Welcome ${regName}! You have registered successfully as a general user.`,
    });
    navigate('/');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <div className="container max-w-md">
        {/* Header with Rotary logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-[100px] w-[250px] rounded-xl overflow-hidden">
            <img
              src="/static/Rotary-3141 Logo.png"
              alt="Rotary logo"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold">Mumbai Blood Connect</h1>
          <p className="text-muted-foreground">Sign in to manage your account</p>
        </div>

        {/* Card with Login/Register */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email"
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2 bg-red-600 hover:bg-red-700">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input 
                      id="reg-name"
                      placeholder="Your full name" 
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <Input 
                      id="reg-email"
                      type="email" 
                      placeholder="your@email.com" 
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-confirm">Confirm Password</Label>
                    <Input 
                      id="reg-confirm"
                      type="password" 
                      placeholder="••••••••" 
                      value={regConfirm}
                      onChange={e => setRegConfirm(e.target.value)}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}