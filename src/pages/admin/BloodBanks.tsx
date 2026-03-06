import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockBloodBanks } from '@/lib/mock-data';
import { Droplets } from 'lucide-react';

export default function AdminBloodBanks() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Blood Bank Management</h2>
      {mockBloodBanks.map((bb) => (
        <Card key={bb.id}>
          <CardContent className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{bb.name}</h3>
                <p className="text-sm text-muted-foreground">{bb.location} • {bb.zone} • {bb.contact}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {bb.inventory.map((inv) => (
                <Badge key={inv.group} variant={inv.units < 3 ? 'destructive' : 'secondary'} className="gap-1">
                  <Droplets className="h-3 w-3" /> {inv.group}: {inv.units} units
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
