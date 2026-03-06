import { Users, Heart, Droplets, Calendar, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStats, mockBloodRequests, mockDonors } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const statCards = [
  { label: 'Total Donors', value: mockStats.totalDonors.toLocaleString(), icon: Users, change: '+12%', up: true },
  { label: 'Active Requests', value: mockStats.activeRequests, icon: Heart, change: '+3', up: true },
  { label: 'Units Available', value: mockStats.unitsAvailable, icon: Droplets, change: '-18', up: false },
  { label: 'Active Campaigns', value: mockStats.activeCampaigns, icon: Calendar, change: '+2', up: true },
];

const requestsByGroup = [
  { group: 'O+', count: 45 }, { group: 'A+', count: 32 }, { group: 'B+', count: 28 },
  { group: 'AB+', count: 12 }, { group: 'O-', count: 18 }, { group: 'A-', count: 8 },
  { group: 'B-', count: 6 }, { group: 'AB-', count: 4 },
];

const monthlyDonations = [
  { month: 'Oct', donations: 120 }, { month: 'Nov', donations: 145 }, { month: 'Dec', donations: 98 },
  { month: 'Jan', donations: 167 }, { month: 'Feb', donations: 189 }, { month: 'Mar', donations: 134 },
];

const PIE_COLORS = ['hsl(0, 72%, 51%)', 'hsl(0, 63%, 31%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(220, 13%, 46%)', 'hsl(0, 84%, 60%)', 'hsl(0, 50%, 40%)', 'hsl(220, 9%, 60%)'];

const urgencyColor = { Emergency: 'destructive' as const, Urgent: 'default' as const, Normal: 'secondary' as const };
const statusColor = { pending: 'secondary' as const, approved: 'default' as const, matched: 'default' as const, completed: 'secondary' as const, cancelled: 'destructive' as const };

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-extrabold">{s.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className={`mt-2 flex items-center gap-1 text-xs ${s.up ? 'text-success' : 'text-destructive'}`}>
                {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {s.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Donations</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyDonations}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="donations" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Requests by Blood Group</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={requestsByGroup} dataKey="count" nameKey="group" cx="50%" cy="50%" outerRadius={90} label={({ group, count }) => `${group}: ${count}`}>
                  {requestsByGroup.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent Blood Requests</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockBloodRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{r.patientName}</p>
                    <p className="text-xs text-muted-foreground">{r.hospital} • {r.bloodGroup} • {r.units} units</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={urgencyColor[r.urgency]}>{r.urgency}</Badge>
                    <Badge variant={statusColor[r.status]}>{r.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Donor Registrations</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDonors.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.zone} • {d.bloodGroup}</p>
                  </div>
                  <Badge variant={d.eligible ? 'default' : 'secondary'}>
                    {d.eligible ? 'Eligible' : 'Not Eligible'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
