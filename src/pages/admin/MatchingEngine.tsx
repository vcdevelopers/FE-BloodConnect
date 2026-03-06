import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { findMatchingDonors, shouldEmergencyBroadcast } from '@/lib/blood-matching';
import { mockDonors, mockBloodRequests, BLOOD_GROUPS, MUMBAI_ZONES, type BloodRequest } from '@/lib/mock-data';
import { Zap, Users, MapPin, Droplets, AlertTriangle } from 'lucide-react';

export default function AdminMatchingEngine() {
  const [selectedRequest, setSelectedRequest] = useState<string>('');
  const [results, setResults] = useState<ReturnType<typeof findMatchingDonors>>([]);
  const [isEmergency, setIsEmergency] = useState(false);

  const request = mockBloodRequests.find((r) => r.id === selectedRequest);

  const runMatching = () => {
    if (!request) return;
    const matches = findMatchingDonors(request, mockDonors, {
      maxResults: 20,
      requestZone: request.hospitalAddress.includes('Bandra') ? 'Bandra / Khar' :
        request.hospitalAddress.includes('Andheri') ? 'Andheri' :
        request.hospitalAddress.includes('Mahim') ? 'Dadar / Worli' : 'South Mumbai',
    });
    setResults(matches);
    setIsEmergency(shouldEmergencyBroadcast(request));
  };

  const proximityColor = { same: 'default' as const, nearby: 'secondary' as const, citywide: 'outline' as const };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Blood Matching Engine</h2>

      <Card>
        <CardHeader><CardTitle>Run Donor Matching</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label>Select Blood Request</Label>
              <Select value={selectedRequest} onValueChange={setSelectedRequest}>
                <SelectTrigger><SelectValue placeholder="Choose a request" /></SelectTrigger>
                <SelectContent>
                  {mockBloodRequests.filter((r) => r.status !== 'completed').map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.patientName} — {r.bloodGroup} ({r.units} units) — {r.urgency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={runMatching} disabled={!selectedRequest} className="gap-2 h-12">
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
                This is a rare blood type ({request?.bloodGroup}) with Emergency urgency. Consider triggering an Emergency Broadcast to all matching donors, hospitals, and NGOs.
              </p>
              <Button variant="destructive" size="sm" className="mt-3 gap-2">
                <Zap className="h-4 w-4" /> Trigger Emergency Broadcast
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
                    <Button size="sm" variant="outline">Alert</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && selectedRequest && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Users className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>Click "Find Matching Donors" to run the algorithm.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
