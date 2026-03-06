import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStats } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download } from 'lucide-react';

const monthlyRequests = [
  { month: 'Oct', requests: 89 }, { month: 'Nov', requests: 102 }, { month: 'Dec', requests: 78 },
  { month: 'Jan', requests: 134 }, { month: 'Feb', requests: 156 }, { month: 'Mar', requests: 97 },
];

const donorActivity = [
  { month: 'Oct', active: 1200, new: 89 }, { month: 'Nov', active: 1340, new: 102 },
  { month: 'Dec', active: 1100, new: 65 }, { month: 'Jan', active: 1500, new: 145 },
  { month: 'Feb', active: 1680, new: 167 }, { month: 'Mar', active: 1450, new: 120 },
];

export default function AdminReports() {
  const exportCSV = () => {
    const csv = 'Month,Requests\n' + monthlyRequests.map(r => `${r.month},${r.requests}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'blood-requests-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports</h2>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Blood Requests per Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRequests}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Donor Activity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={donorActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="hsl(0, 72%, 51%)" strokeWidth={2} />
                <Line type="monotone" dataKey="new" stroke="hsl(142, 71%, 45%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
