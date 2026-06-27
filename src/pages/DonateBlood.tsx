import { useState } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS, MUMBAI_ZONES, Group } from '@/lib/mock-data';

export default function DonateBlood() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Thank You!</h2>
            <p className="text-muted-foreground">
              Your donor registration has been received. You are now part of Mumbai Blood Connect's donor network. We'll notify you when someone needs your blood type.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Register as a Blood Donor</h1>
          <p className="mt-1 text-muted-foreground">Join Mumbai's life-saving donor network</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Your full name" required />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input id="mobile" placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input id="age" type="number" min={18} max={65} placeholder="18-65" required />
                </div>
                <div>
                  <Label>Gender *</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Blood Requirement Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                    <SelectContent>
                      {Group.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Blood Group</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lastDonation">Last Donation Date</Label>
                  <Input id="lastDonation" type="date" />
                </div>
                <div>
                  <Label>Preferred Area in Mumbai *</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent>
                      {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Your address in Mumbai" />
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-3 font-semibold">Health Declaration</h3>
                <div className="space-y-3">
                  {[
                    'I am between 18-65 years of age and weigh more than 45 kg.',
                    'I have not donated blood in the last 90 days (men) / 120 days (women).',
                    'I am not currently on medication for any serious illness.',
                    'I have not had any tattoos or piercings in the last 6 months.',
                    'I confirm all information provided is accurate.',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Checkbox id={`health-${i}`} required />
                      <label htmlFor={`health-${i}`} className="text-sm leading-tight text-muted-foreground cursor-pointer">
                        {text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2">
                <Heart className="h-5 w-5" /> Register as Donor
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
