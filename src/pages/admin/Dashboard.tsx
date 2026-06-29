import { useState, useEffect } from 'react';
import { Users, Heart, Droplets, Calendar, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['hsl(0, 72%, 51%)', 'hsl(0, 63%, 31%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(220, 13%, 46%)', 'hsl(0, 84%, 60%)', 'hsl(0, 50%, 40%)', 'hsl(220, 9%, 60%)'];
const urgencyColor = { Emergency: 'destructive' as const, Urgent: 'default' as const, Normal: 'secondary' as const };
const statusColor = { pending: 'secondary' as const, approved: 'default' as const, matched: 'default' as const, completed: 'secondary' as const, cancelled: 'destructive' as const };

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({ totalDonors: 0, activeRequests: 0, unitsAvailable: 0, activeCampaigns: 0, requestsToday: 0 });
  const [requests, setRequests] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      Promise.all([
        fetch('/api/stats/').then(res => res.json()),
        fetch('/api/requests/').then(res => res.json()),
        fetch('/api/donors/').then(res => res.json())
      ])
        .then(([statsData, reqs, dons]) => {
          setStats(statsData);
          setRequests(reqs);
          setDonors(dons);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading dashboard data:', err);
          setLoading(false);
        });
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Compute charts on the fly
  const getRequestsBarChartData = () => {
    const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Build last 6 months with year context to handle boundaries
    const last6Months: { monthLabel: string; monthIndex: number; year: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonthIndex = (currentMonthIdx - i + 12) % 12;
      const targetYear = targetMonthIndex > currentMonthIdx ? currentYear - 1 : currentYear;
      last6Months.push({
        monthLabel: MONTHS_SHORT[targetMonthIndex],
        monthIndex: targetMonthIndex,
        year: targetYear
      });
    }

    return last6Months.map(({ monthLabel, monthIndex, year }) => {
      // Calculate real total units requested in this specific month/year
      let totalUnits = 0;
      requests.forEach(r => {
        if (r.date) {
          const dateObj = new Date(r.date);
          if (dateObj.getMonth() === monthIndex && dateObj.getFullYear() === year) {
            totalUnits += r.units || 1;
          }
        }
      });

      return {
        month: monthLabel,
        donations: totalUnits
      };
    });
  };

  const getRequestsByGroup = () => {
    const map: Record<string, number> = {};
    requests.forEach(r => {
      const g = r.blood_group;
      if (g) {
        map[g] = (map[g] || 0) + (r.units || 1);
      }
    });
    
    const data = Object.entries(map).map(([group, count]) => ({ group, count }));
    return data.length > 0 ? data : [{ group: 'No Data', count: 1 }];
  };

  const statCards = [
    { label: 'Total Donors', value: stats.totalDonors.toLocaleString(), icon: Users },
    { label: 'Active Requests', value: stats.activeRequests, icon: Heart },
    { label: 'Units Available', value: stats.unitsAvailable, icon: Droplets },
    { label: 'Active Campaigns', value: stats.activeCampaigns, icon: Calendar },
  ];

  const recentRequests = requests.slice(0, 4);
  const recentDonors = donors.slice(0, 4);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
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
                  <BarChart data={getRequestsBarChartData()}>
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
                    <Pie data={getRequestsByGroup()} dataKey="count" nameKey="group" cx="50%" cy="50%" outerRadius={90} label={({ group, count }) => `${group}: ${count}`}>
                      {getRequestsByGroup().map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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
                  {recentRequests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{r.patient_name}</p>
                        <p className="text-xs text-muted-foreground">{r.hospital} • {r.blood_group} • {r.units} units</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={urgencyColor[r.urgency as keyof typeof urgencyColor] || 'secondary'}>{r.urgency}</Badge>
                        <Badge variant={statusColor[r.status as keyof typeof statusColor] || 'secondary'}>{r.status}</Badge>
                      </div>
                    </div>
                  ))}
                  {recentRequests.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No requests submitted yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent Donor Registrations</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDonors.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.zone} • {d.blood_group}</p>
                      </div>
                      <Badge variant={d.eligible ? 'default' : 'secondary'}>
                        {d.eligible ? 'Eligible' : 'Not Eligible'}
                      </Badge>
                    </div>
                  ))}
                  {recentDonors.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No donors registered yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
