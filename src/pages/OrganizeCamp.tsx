import { useState } from 'react';
import { CheckCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MUMBAI_ZONES } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrganizeCamp() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Camp Submitted!</h2>
            <p className="text-muted-foreground">
              Your blood donation camp request has been submitted for admin approval. We'll contact you once it's approved and published.
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
          <h1 className="text-3xl font-bold">Organize a Blood Camp</h1>
          <p className="mt-1 text-muted-foreground">Submit your camp details for admin approval</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Organization Name *</Label>
                  <Input placeholder="Your organization" required />
                </div>
                <div>
                  <Label>Contact Person *</Label>
                  <Input placeholder="Contact person name" required />
                </div>
                <div>
                  <Label>Mobile *</Label>
                  <Input placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" placeholder="org@email.com" required />
                </div>
                <div>
                  <Label>Campaign Location *</Label>
                  <Input placeholder="Venue address" required />
                </div>
                <div>
                  <Label>Area / Zone *</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent>
                      {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date *</Label>
                  <Input type="date" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Time *</Label>
                    <Input type="time" required />
                  </div>
                  <div>
                    <Label>End Time *</Label>
                    <Input type="time" required />
                  </div>
                </div>
                <div>
                  <Label>Expected Donors</Label>
                  <Input type="number" min={10} placeholder="e.g. 50" />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea placeholder="Tell us about your camp..." rows={4} />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2">
                <Building2 className="h-5 w-5" /> Submit Camp for Approval
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
