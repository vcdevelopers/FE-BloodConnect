import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <div className="container max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Droplets className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Mumbai Blood Connect</h1>
          <p className="text-muted-foreground">Sign in to manage your account</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={(e) => { e.preventDefault(); navigate('/admin'); }} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }} className="space-y-4">
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
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
