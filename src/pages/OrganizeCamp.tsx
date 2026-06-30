import { useState } from 'react';
import { CheckCircle, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MUMBAI_ZONES } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function OrganizeCamp() {
  const [submitted, setSubmitted] = useState(false);
  const [organizer, setOrganizer] = useState('');
  const [campName, setCampName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [expectedDonors, setExpectedDonors] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: campName || `${organizer} Donation Drive`,
      organizer,
      location,
      zone,
      date,
      time: `${startTime} - ${endTime}`,
      slots: parseInt(expectedDonors) || 100,
      slots_booked: 0,
      description: description || `Contact: ${contactName} (${phone}, ${email})`,
      status: 'pending'
    };

    fetch('/api/camps/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(() => {
        setSubmitted(true);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: 'Could not submit camp details. Please check the inputs and try again.',
        });
        setIsSubmitting(false);
      });
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="organizer">Organization Name *</Label>
                  <Input 
                    id="organizer"
                    placeholder="Your organization" 
                    value={organizer}
                    onChange={e => setOrganizer(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="campName">Camp/Campaign Name *</Label>
                  <Input 
                    id="campName"
                    placeholder="e.g. Annual Blood Donation Camp" 
                    value={campName}
                    onChange={e => setCampName(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact Person *</Label>
                  <Input 
                    id="contact"
                    placeholder="Contact person name" 
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input 
                    id="mobile"
                    placeholder="+91 98765 43210" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="org@email.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="location">Campaign Location *</Label>
                  <Input 
                    id="location"
                    placeholder="Venue address" 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label>Area / Zone *</Label>
                  <Select value={zone} onValueChange={setZone} required>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent>
                      {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input 
                    id="date"
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="start">Start Time *</Label>
                    <Input 
                      id="start"
                      type="time" 
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">End Time *</Label>
                    <Input 
                      id="end"
                      type="time" 
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="donors">Expected Donors</Label>
                  <Input 
                    id="donors"
                    type="number" 
                    min={10} 
                    placeholder="e.g. 50" 
                    value={expectedDonors}
                    onChange={e => setExpectedDonors(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc"
                  placeholder="Tell us about your camp..." 
                  rows={4} 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Building2 className="h-5 w-5" /> Submit Camp for Approval
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
