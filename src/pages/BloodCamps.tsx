import { useState } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { mockCampaigns, MUMBAI_ZONES } from '@/lib/mock-data';

export default function BloodCamps() {
  const [zone, setZone] = useState('');
  const filtered = zone ? mockCampaigns.filter((c) => c.zone === zone) : mockCampaigns;

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Blood Donation Camps</h1>
          <p className="mt-1 text-muted-foreground">Find and register for upcoming blood donation camps in Mumbai</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full sm:w-64">
            <Label>Filter by Area</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger><SelectValue placeholder="All Areas" /></SelectTrigger>
              <SelectContent>
                {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {zone && (
            <Button variant="ghost" onClick={() => setZone('')} size="sm">Clear filter</Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((camp) => {
            const pct = Math.round((camp.slotsBooked / camp.slots) * 100);
            return (
              <Card key={camp.id} className="overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-3">{camp.zone}</Badge>
                  <h3 className="mb-1 text-lg font-bold">{camp.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{camp.organizer}</p>
                  <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{camp.date}</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{camp.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{camp.location}</div>
                  </div>
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>{camp.slotsBooked} registered</span>
                      <span>{camp.slots} slots</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{camp.description}</p>
                  <Button className="w-full gap-2">
                    <Users className="h-4 w-4" /> Register to Donate
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-30" />
            <p>No camps found in this area. Try a different filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
