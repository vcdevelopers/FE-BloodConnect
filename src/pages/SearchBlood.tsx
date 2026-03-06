import { useState } from 'react';
import { Search, MapPin, Phone, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BLOOD_GROUPS, MUMBAI_ZONES, URGENCY_LEVELS, mockBloodBanks } from '@/lib/mock-data';

export default function SearchBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [zone, setZone] = useState('');
  const [searched, setSearched] = useState(false);

  const results = mockBloodBanks.filter((bb) => {
    if (bloodGroup && !bb.inventory.some((i) => i.group === bloodGroup && i.units > 0)) return false;
    if (zone && bb.zone !== zone) return false;
    return true;
  });

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Search Blood Availability</h1>
          <p className="mt-1 text-muted-foreground">Find blood banks and availability near you in Mumbai</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>Blood Group</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Area / Zone</Label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                  <SelectContent>
                    {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pincode</Label>
                <Input placeholder="e.g. 400050" />
              </div>
              <div className="flex items-end">
                <Button className="w-full gap-2" onClick={() => setSearched(true)}>
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((bb) => (
            <Card key={bb.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{bb.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {bb.location} • {bb.distance}
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {bb.inventory.map((inv) => (
                    <Badge
                      key={inv.group}
                      variant={bloodGroup === inv.group ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      <Droplets className="h-3 w-3" /> {inv.group}: {inv.units} units
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {bb.contact}
                  </div>
                  <Button size="sm">Request</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length === 0 && searched && (
          <div className="mt-12 text-center text-muted-foreground">
            <Droplets className="mx-auto mb-4 h-12 w-12 opacity-30" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try different filters or expand your search area.</p>
          </div>
        )}
      </div>
    </div>
  );
}
