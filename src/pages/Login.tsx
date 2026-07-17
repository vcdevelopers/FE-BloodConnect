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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        toast({
          title: "Login Successful",
          description: "Welcome to Mumbai Blood Connect Admin Console.",
        });
        localStorage.setItem('admin_token', 'true');
        navigate('/admin');
      } else {
        throw new Error(data.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: err.message || "Failed to connect to authentication server. Please try again.",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Passwords do not match.",
      });
      return;
    }
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        toast({
          title: "Account Created",
          description: `Welcome ${regName}! Your account has been successfully created.`,
        });
        // Save token to localStorage for immediate authentication
        localStorage.setItem('admin_token', 'true');
        navigate('/');
      } else {
        throw new Error(data.message || 'Failed to register.');
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.message || "Failed to connect to authentication server. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <div className="container max-w-md">
        {/* Header section with corrected spacing constraints */}
        <div className="mb-6 text-center">
          {/* Removed h-[400px] box restrictions to close the dead spacing gap completely */}
          <div className="flex items-center justify-center mb-0">
             <img
              src={`${import.meta.env.BASE_URL}regal.jpg`}
              alt="Regal logo"
              className="h-20 w-auto object-contain sm:h-21"
            />
           
            <img
              src={`${import.meta.env.BASE_URL}Create Lasting Impact.png`}
              alt="lasting impact logo"
              className="h-22 w-auto object-contain sm:h-20"
            />
          </div>
          <div className="flex items-center justify-center mb-4">
            <img
              src={`${import.meta.env.BASE_URL}rotary1.jpg`}
              alt="Rotary logo"
              className="h-22 w-auto object-contain sm:h-14"
            />
          </div>
          <h1 className="text-2xl font-bold">Mumbai Blood Tracker</h1>
          <p className="text-muted-foreground mt-1">Sign in to manage your account</p>
        </div>

        {/* Card with Login/Register */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                {/* <TabsTrigger value="register" className="flex-1">Register</TabsTrigger> */}
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