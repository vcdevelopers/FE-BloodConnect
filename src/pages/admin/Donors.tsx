import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Loader2, Check, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS, MUMBAI_ZONES } from '@/lib/mock-data';

export default function AdminDonors() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter States
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('ALL');
  const [zone, setZone] = useState('ALL');
  const [eligibility, setEligibility] = useState('ALL');

  const fetchDonors = () => {
    fetch('/api/donors/')
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDonors();
    const interval = setInterval(fetchDonors, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = donors.filter(d => {
    const matchesSearch = 
      (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.phone || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.email || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesGroup = group === 'ALL' || d.blood_group === group;
    const matchesZone = zone === 'ALL' || d.zone === zone;
    
    let matchesEligibility = true;
    if (eligibility === 'eligible') {
      matchesEligibility = d.eligible === true;
    } else if (eligibility === 'ineligible') {
      matchesEligibility = d.eligible === false;
    }

    return matchesSearch && matchesGroup && matchesZone && matchesEligibility;
  });

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this donor profile?")) return;
    setDeletingId(id);
    fetch(`/api/donors/${id}/`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        toast({
          title: "Donor Removed",
          description: "The donor profile has been successfully deleted.",
        });
        setDonors(prev => prev.filter(d => d.id !== id));
        setDeletingId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not remove donor profile.",
        });
        setDeletingId(null);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Donor Management</h2>
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {donors.length} donors
        </div>
      </div>

      {/* Filters row */}
      <div className="grid gap-4 md:grid-cols-4 bg-card p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search name, phone, email..." 
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
          <Select value={eligibility} onValueChange={setEligibility}>
            <SelectTrigger>
              <SelectValue placeholder="All Eligibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Eligibility</SelectItem>
              <SelectItem value="eligible">Eligible</SelectItem>
              <SelectItem value="ineligible">Ineligible (Cooldown)</SelectItem>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Last Donation</TableHead>
                    <TableHead>Donations</TableHead>
                    <TableHead>Eligible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No matching donors found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">
                          <div>{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.phone} • {d.email}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{d.blood_group}</Badge></TableCell>
                        <TableCell>{d.zone}</TableCell>
                        <TableCell>{d.last_donation || 'Never'}</TableCell>
                        <TableCell>{d.total_donations || 0}</TableCell>
                        <TableCell>
                          <Badge variant={d.eligible ? 'default' : 'secondary'}>
                            {d.eligible ? (
                              <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Yes</span>
                            ) : (
                              `No (${d.next_eligible || 'Cooldown'})`
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            title="Remove"
                            disabled={deletingId === d.id}
                            onClick={() => handleDelete(d.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            {deletingId === d.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
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
