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
    <div className="py-8">
      <div className="container max-w-2xl">
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary">Emergency Blood Request</h3>
              <p className="text-sm text-muted-foreground">
                Fill this form for urgent blood needs. Our system will alert matching donors in your area automatically.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="patient">Patient Name *</Label>
                  <Input 
                    id="patient" 
                    placeholder="Patient's full name" 
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label>Blood Group *</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup} required>
                    <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="units">Units Needed *</Label>
                  <Input 
                    id="units" 
                    type="number" 
                    min={1} 
                    max={10} 
                    placeholder="e.g. 2" 
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label>Urgency Level *</Label>
                  <Select value={urgency} onValueChange={setUrgency} required>
                    <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                    <SelectContent>
                      {URGENCY_LEVELS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hospital">Hospital Name *</Label>
                  <Input 
                    id="hospital" 
                    placeholder="Hospital name" 
                    value={hospital}
                    onChange={e => setHospital(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="hospitalAddr">Hospital Address *</Label>
                  <Input 
                    id="hospitalAddr" 
                    placeholder="Hospital address" 
                    value={hospitalAddress}
                    onChange={e => setHospitalAddress(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="attendant">Attendant Name *</Label>
                  <Input 
                    id="attendant" 
                    placeholder="Contact person name" 
                    value={attendantName}
                    onChange={e => setAttendantName(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
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
