// import { mockCampaigns, MUMBAI_ZONES } from '@/lib/mock-data';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MUMBAI_ZONES } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { CampCard, Camp } from '@/components/CampCard';

export default function BloodCamps() {
  const [zone, setZone] = useState('');
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchCamps = () => {
    fetch('/api/camps/?status=upcoming')
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

  const handleRegister = (campId: number) => {
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
            {filtered.map((camp) => (
              <CampCard 
                key={camp.id} 
                camp={camp} 
                bookingId={bookingId} 
                handleRegister={handleRegister} 
              />
            ))}
          </div>
        )}

        {!loading && camps.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground max-w-md mx-auto space-y-4 py-8">
            <div className="mx-auto w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Upcoming Blood Donation Camps</h3>
              <p className="text-sm text-muted-foreground">
                There are currently no scheduled donation camps. Please check back later.
              </p>
            </div>
          </div>
        )}

        {!loading && camps.length > 0 && filtered.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground py-8">
            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-30" />
            <p className="text-sm">No camps found in this area. Try a different filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
