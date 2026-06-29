import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { findMatchingDonors, shouldEmergencyBroadcast } from '@/lib/blood-matching';
import { mockDonors, mockBloodRequests, BLOOD_GROUPS, MUMBAI_ZONES, type BloodRequest } from '@/lib/mock-data';
import { Zap, Users, MapPin, Droplets, AlertTriangle } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { findMatchingDonors, shouldEmergencyBroadcast } from '@/lib/blood-matching';
import { BLOOD_GROUPS, MUMBAI_ZONES } from '@/lib/mock-data';
import { Zap, Users, MapPin, Droplets, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminMatchingEngine() {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [requests, setRequests] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      fetch('/api/requests/').then(res => res.json()),
      fetch('/api/donors/').then(res => res.json())
    ])
      .then(([reqs, dons]) => {
        setRequests(reqs);
        setDonors(dons);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching requests/donors:', err);
        setLoading(false);
      });
  }, []);

  const mapRequestToCamel = (req: any) => ({
    id: String(req.id),
    patientName: req.patient_name,
    bloodGroup: req.blood_group,
    units: req.units,
    hospital: req.hospital,
    hospitalAddress: req.hospital_address || '',
    attendantName: req.attendant_name || '',
    phone: req.phone,
    urgency: req.urgency,
    status: req.status,
    date: req.date,
    matchedDonors: req.matched_donors_count || 0
  });

  const mapDonorToCamel = (d: any) => ({
    id: String(d.id),
    name: d.name,
    bloodGroup: d.blood_group,
    zone: d.zone,
    phone: d.phone,
    email: d.email,
    gender: d.gender,
    age: d.age,
    lastDonation: d.last_donation || '2000-01-01',
    totalDonations: d.total_donations || 0,
    eligible: d.eligible !== undefined ? d.eligible : true,
    nextEligible: d.next_eligible || '',
    status: d.status || 'active'
  });

  const selectedRequest = requests.find((r) => String(r.id) === selectedRequestId);

  const runMatching = () => {
    if (!selectedRequest) return;
    const reqCamel = mapRequestToCamel(selectedRequest);
    const donsCamel = donors.map(mapDonorToCamel);

    const matches = findMatchingDonors(reqCamel, donsCamel, {
      maxResults: 20,
      requestZone: reqCamel.hospitalAddress.includes('Bandra') ? 'Bandra / Khar' :
        reqCamel.hospitalAddress.includes('Andheri') ? 'Andheri' :
        reqCamel.hospitalAddress.includes('Mahim') ? 'Dadar / Worli' : 'South Mumbai',
    });
    setResults(matches);
    setIsEmergency(shouldEmergencyBroadcast(reqCamel));
  };

  const handleBroadcast = () => {
    setBroadcasting(true);
    // Simulate emergency broadcast post
    setTimeout(() => {
      toast({
        title: "Emergency Broadcast Sent",
        description: `Alerts sent to ${results.length} matching donors for ${selectedRequest.patient_name}.`,
      });
      setBroadcasting(false);
    }, 1500);
  };

  const proximityColor = { same: 'default' as const, nearby: 'secondary' as const, citywide: 'outline' as const };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Blood Matching Engine</h2>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle>Run Donor Matching</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Label>Select Blood Request</Label>
                  <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
                    <SelectTrigger><SelectValue placeholder="Choose a request" /></SelectTrigger>
                    <SelectContent>
                      {requests.filter((r) => r.status !== 'completed').map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.patient_name} — {r.blood_group} ({r.units} units) — {r.urgency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={runMatching} disabled={!selectedRequestId} className="gap-2 h-12">
                  <Zap className="h-4 w-4" /> Find Matching Donors
                </Button>
              </div>
            </CardContent>
          </Card>

          {isEmergency && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="flex items-start gap-3 p-5">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-bold text-destructive">Emergency Broadcast Recommended</p>
                  <p className="text-sm text-muted-foreground">
                    This is a rare blood type ({selectedRequest?.blood_group}) with Emergency urgency. Consider triggering an Emergency Broadcast to all matching donors, hospitals, and NGOs.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-3 gap-2" onClick={handleBroadcast} disabled={broadcasting}>
                    {broadcasting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Broadcasting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" /> Trigger Emergency Broadcast
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {results.length} Matching Donors Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.map((match, i) => (
                    <div key={match.donor.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="font-medium">{match.donor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {match.donor.bloodGroup} • {match.donor.zone} • {match.donor.totalDonations} donations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={match.matchType === 'exact' ? 'default' : 'secondary'}>
                          {match.matchType}
                        </Badge>
                        <Badge variant={proximityColor[match.zoneProximity]}>
                          <MapPin className="mr-1 h-3 w-3" />{match.zoneProximity}
                        </Badge>
                        <div className="min-w-[60px] text-right">
                          <span className="text-sm font-bold text-primary">{match.score}</span>
                          <span className="text-xs text-muted-foreground"> pts</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => {
                          toast({
                            title: "Notification Sent",
                            description: `Alert sent to ${match.donor.name} (${match.donor.phone})`,
                          });
                        }}>Alert</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {results.length === 0 && selectedRequestId && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Users className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p>Click "Find Matching Donors" to run the algorithm.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
