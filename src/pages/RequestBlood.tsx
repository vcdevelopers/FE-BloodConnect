import { useState } from 'react';
import { Heart, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function RequestBlood() {
  const [submitted, setSubmitted] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState('');
  const [urgency, setUrgency] = useState('');
  const [hospital, setHospital] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [attendantName, setAttendantName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      patient_name: patientName,
      blood_group: bloodGroup,
      units: parseInt(units) || 1,
      urgency,
      hospital,
      hospital_address: hospitalAddress,
      attendant_name: attendantName,
      phone,
      status: 'pending'
    };

    fetch('/api/requests/', {
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
          title: 'Request Failed',
          description: 'Could not submit blood request. Please check the inputs and try again.',
        });
        setIsSubmitting(false);
      });
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Request Submitted!</h2>
            <p className="text-muted-foreground">
              Your blood request has been received. Our team will notify matching donors and contact you shortly. For emergencies, call +91 22 1234 5678.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Submit a Blood Request
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We will alert verified matching donors in your area immediately
          </p>
        </div>

        <Card className="border shadow-lg backdrop-blur bg-card/50">
          <CardContent className="p-8">
            <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive text-sm">Emergency Verification Notice</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please ensure patient details are accurate. Hospital name and mobile contacts are verified before matching alerts are broadcast.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="patient" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient Name *</Label>
                  <Input 
                    id="patient" 
                    placeholder="Patient's full name" 
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="h-10 text-sm"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Blood Group *</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup} required>
                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select blood group" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="units" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Units Needed *</Label>
                  <Input 
                    id="units" 
                    type="number" 
                    min={1} 
                    max={10} 
                    placeholder="e.g. 2" 
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                    className="h-10 text-sm"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Urgency Level *</Label>
                  <Select value={urgency} onValueChange={setUrgency} required>
                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select urgency" /></SelectTrigger>
                    <SelectContent>
                      {URGENCY_LEVELS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hospital" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hospital Name *</Label>
                  <Input 
                    id="hospital" 
                    placeholder="Hospital name" 
                    value={hospital}
                    onChange={e => setHospital(e.target.value)}
                    className="h-10 text-sm"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hospitalAddr" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hospital Address *</Label>
                  <Input 
                    id="hospitalAddr" 
                    placeholder="Hospital address" 
                    value={hospitalAddress}
                    onChange={e => setHospitalAddress(e.target.value)}
                    className="h-10 text-sm"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="attendant" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attendant Name *</Label>
                  <Input 
                    id="attendant" 
                    placeholder="Contact person name" 
                    value={attendantName}
                    onChange={e => setAttendantName(e.target.value)}
                    className="h-10 text-sm"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mobile Number *</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="h-10 text-sm"
                    required 
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2 h-12 bg-destructive hover:bg-destructive/90 text-white font-semibold transition-transform active:scale-[0.98]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting Request...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 fill-current" /> Submit Blood Request
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
