import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCampaigns } from '@/lib/mock-data';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';

export default function AdminCampaigns() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Campaign Management</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Slots</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.organizer}</TableCell>
                    <TableCell>{c.location}</TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>{c.slotsBooked}/{c.slots}</TableCell>
                    <TableCell><Badge variant="secondary">{c.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" title="Approve"><CheckCircle className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" title="Edit"><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
