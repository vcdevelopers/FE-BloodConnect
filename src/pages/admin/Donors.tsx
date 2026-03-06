import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockDonors } from '@/lib/mock-data';
import { Eye, Edit, UserX } from 'lucide-react';

export default function AdminDonors() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Donor Management</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Last Donation</TableHead>
                  <TableHead>Donations</TableHead>
                  <TableHead>Eligible</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDonors.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell><Badge variant="outline">{d.bloodGroup}</Badge></TableCell>
                    <TableCell>{d.zone}</TableCell>
                    <TableCell>{d.lastDonation}</TableCell>
                    <TableCell>{d.totalDonations}</TableCell>
                    <TableCell>
                      <Badge variant={d.eligible ? 'default' : 'secondary'}>
                        {d.eligible ? 'Yes' : `No (${d.nextEligible})`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" title="View"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" title="Edit"><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" title="Deactivate"><UserX className="h-4 w-4" /></Button>
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
