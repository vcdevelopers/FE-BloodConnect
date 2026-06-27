import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import your Rotary logo
// import rotaryLogo from '; // using alias @ -> src

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <div className="container max-w-md">
        {/* Header with Rotary logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-[100px] w-[250px] rounded-xl overflow-hidden">
  <img
    src="/Rotary-3141 Logo.png"
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
                <form
                  onSubmit={(e) => { e.preventDefault(); navigate('/admin'); }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full gap-2 bg-red-600 hover:bg-red-700">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form
                  onSubmit={(e) => { e.preventDefault(); navigate('/'); }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="Your full name" required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" required />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="••••••••" required />
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