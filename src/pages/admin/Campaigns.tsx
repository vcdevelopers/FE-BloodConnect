import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Trash2, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MUMBAI_ZONES } from '@/lib/mock-data';

export default function AdminCampaigns() {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter States
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('ALL');
  const [status, setStatus] = useState('ALL');

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
    const interval = setInterval(fetchCamps, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = camps.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.organizer || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesZone = zone === 'ALL' || c.zone === zone;
    const matchesStatus = status === 'ALL' || c.status === status;

    return matchesSearch && matchesZone && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setActionId(id);
    fetch(`/api/camps/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'upcoming' })
    })
      .then(res => {
        if (!res.ok) throw new Error('Approval failed');
        return res.json();
      })
      .then(updated => {
        toast({
          title: "Campaign Approved",
          description: `Successfully activated campaign drive: ${updated.name}`,
        });
        setCamps(prev => prev.map(c => c.id === id ? updated : c));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not approve campaign drive.",
        });
        setActionId(null);
      });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this campaign drive?")) return;
    setActionId(id);
    fetch(`/api/camps/${id}/`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        toast({
          title: "Campaign Deleted",
          description: "The campaign drive has been deleted.",
        });
        setCamps(prev => prev.filter(c => c.id !== id));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not delete campaign drive.",
        });
        setActionId(null);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Campaign Management</h2>
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {camps.length} campaigns
        </div>
      </div>

      {/* Filters row */}
      <div className="grid gap-4 md:grid-cols-3 bg-card p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search camp, organizer, location..." 
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div>
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger>
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Zones</SelectItem>
              {MUMBAI_ZONES.map((z) => (
                <SelectItem key={z} value={z}>{z}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Slots</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No matching campaigns found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c) => {
                      const booked = c.slots_booked !== undefined ? c.slots_booked : c.slotsBooked || 0;
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            <div>{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.time}</div>
                          </TableCell>
                          <TableCell>{c.organizer}</TableCell>
                          <TableCell>
                            <div>{c.location}</div>
                            <div className="text-xs text-muted-foreground">{c.zone}</div>
                          </TableCell>
                          <TableCell>{c.date}</TableCell>
                          <TableCell>{booked}/{c.slots}</TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'upcoming' ? 'default' : 'secondary'}>
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Approve"
                                disabled={c.status === 'upcoming' || c.status === 'completed' || actionId === c.id}
                                onClick={() => handleApprove(c.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-success" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Delete"
                                disabled={actionId === c.id}
                                onClick={() => handleDelete(c.id)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
