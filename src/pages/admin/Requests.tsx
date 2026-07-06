import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2, Search, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '@/lib/mock-data';

const urgencyColor = { Emergency: 'destructive' as const, Urgent: 'default' as const, Normal: 'secondary' as const };
const statusColor = { 
  pending: 'secondary' as const, 
  approved: 'default' as const, 
  matched: 'default' as const, 
  completed: 'success' as const, 
  cancelled: 'destructive' as const 
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter States
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('ALL');
  const [urgency, setUrgency] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const fetchRequests = () => {
    fetch('/api/requests/')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = requests.filter(r => {
    const matchesSearch = 
      (r.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.hospital || '').toLowerCase().includes(search.toLowerCase());
    const matchesGroup = group === 'ALL' || r.blood_group === group;
    const matchesUrgency = urgency === 'ALL' || r.urgency === urgency;
    const matchesStatus = status === 'ALL' || r.status === status;
    return matchesSearch && matchesGroup && matchesUrgency && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setActionId(id);
    fetch(`/api/requests/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'approved' })
    })
      .then(res => {
        if (!res.ok) throw new Error('Approval failed');
        return res.json();
      })
      .then(updated => {
        toast({
          title: "Request Approved",
          description: `Successfully approved request for ${updated.patient_name}`,
        });
        setRequests(prev => prev.map(r => r.id === id ? updated : r));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not approve blood request.",
        });
        setActionId(null);
      });
  };

  const handleCancel = (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    setActionId(id);
    fetch(`/api/requests/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'cancelled' })
    })
      .then(res => {
        if (!res.ok) throw new Error('Cancellation failed');
        return res.json();
      })
      .then(updated => {
        toast({
          title: "Request Cancelled",
          description: `Request for ${updated.patient_name} has been cancelled.`,
        });
        setRequests(prev => prev.map(r => r.id === id ? updated : r));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not cancel blood request.",
        });
        setActionId(null);
      });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this request?")) return;
    setActionId(id);
    fetch(`/api/requests/${id}/`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Deletion failed');
        toast({
          title: "Request Deleted",
          description: "The blood request has been permanently deleted.",
        });
        setRequests(prev => prev.filter(r => r.id !== id));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not delete blood request.",
        });
        setActionId(null);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Blood Requests</h2>
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {requests.length} requests
        </div>
      </div>

      {/* Filters row */}
      <div className="grid gap-4 md:grid-cols-4 bg-card p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patient, hospital..." 
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div>
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger>
              <SelectValue placeholder="All Blood Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Blood Groups</SelectItem>
              {BLOOD_GROUPS.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger>
              <SelectValue placeholder="All Urgency Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Urgency Levels</SelectItem>
              {URGENCY_LEVELS.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
                    <TableHead>Patient</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No matching blood requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.patient_name}</TableCell>
                        <TableCell><Badge variant="outline">{r.blood_group}</Badge></TableCell>
                        <TableCell>{r.units}</TableCell>
                        <TableCell>{r.hospital}</TableCell>
                        <TableCell>
                          <Badge variant={urgencyColor[r.urgency as keyof typeof urgencyColor] || 'secondary'}>
                            {r.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColor[r.status as keyof typeof statusColor] || 'secondary'}>
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Approve"
                              disabled={r.status === 'approved' || r.status === 'completed' || actionId === r.id}
                              onClick={() => handleApprove(r.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-success" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Cancel"
                              disabled={r.status === 'cancelled' || r.status === 'completed' || actionId === r.id}
                              onClick={() => handleCancel(r.id)}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Delete"
                              className="hover:bg-destructive/10"
                              disabled={actionId === r.id}
                              onClick={() => handleDelete(r.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
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
