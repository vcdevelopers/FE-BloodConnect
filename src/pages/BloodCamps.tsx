import { useState } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { mockCampaigns, MUMBAI_ZONES } from '@/lib/mock-data';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { MUMBAI_ZONES } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function BloodCamps() {
  const [zone, setZone] = useState('');
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCamps = () => {
    fetch('/api/camps/')
      .then(res => res.json())
      .then(data => {
        setCamps(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const handleRegister = (campId: string) => {
    setBookingId(campId);
    fetch(`/api/camps/${campId}/book_slot/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
      })
      .then(updatedCamp => {
        toast({
          title: "Registration Successful",
          description: `You are now registered for the drive: ${updatedCamp.name}`,
        });
        setCamps(prev => prev.map(c => c.id === campId ? updatedCamp : c));
        setBookingId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Could not book your slot. Please try again.",
        });
        setBookingId(null);
      });
  };

  const filtered = zone ? camps.filter((c) => c.zone?.toLowerCase() === zone.toLowerCase()) : camps;

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

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((camp) => {
              const booked = camp.slots_booked !== undefined ? camp.slots_booked : camp.slotsBooked || 0;
              const pct = Math.round((booked / camp.slots) * 100);
              const isFull = booked >= camp.slots;
              
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
                        <span>{booked} registered</span>
                        <span>{camp.slots} slots</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground min-h-[40px]">{camp.description}</p>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => handleRegister(camp.id)}
                      disabled={isFull || bookingId === camp.id}
                    >
                      {bookingId === camp.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Registering...
                        </>
                      ) : isFull ? (
                        'Camp Full'
                      ) : (
                        <>
                          <Users className="h-4 w-4" /> Register to Donate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-30" />
            <p>No camps found in this area. Try a different filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
