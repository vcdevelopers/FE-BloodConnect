import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Loader2 } from 'lucide-react';

export default function AdminReports() {
  const [requests, setRequests] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = () => {
    Promise.all([
      fetch('/api/requests/').then(res => res.json()),
      fetch('/api/donors/').then(res => res.json())
    ])
      .then(([reqs, dons]) => {
        setRequests(reqs);
        setDonors(dons);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching report data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReportData();
    const interval = setInterval(fetchReportData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getMonthlyRequestsData = () => {
    const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Build last 6 months with year context to handle year boundaries
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
        requests: totalUnits
      };
    });
  };

  const getDonorActivityData = () => {
    const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Build last 6 months list with year context
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

    // Map donors to their activity date timestamp
    const donorTimestamps = donors.map(d => {
      if (d.last_donation) {
        const dateObj = new Date(d.last_donation);
        return {
          month: dateObj.getMonth(),
          year: dateObj.getFullYear()
        };
      } else {
        // Fallback for new signups to current month/year
        return {
          month: currentMonthIdx,
          year: currentYear
        };
      }
    });

    return last6Months.map(({ monthLabel, monthIndex, year }) => {
      // Calculate cumulative count of active donors active on or before this month/year
      const activeCount = donorTimestamps.filter(t => {
        if (t.year < year) return true;
        if (t.year === year && t.month <= monthIndex) return true;
        return false;
      }).length;

      // Calculate new donor additions in this specific month/year
      const newAdditionsCount = donorTimestamps.filter(t => t.year === year && t.month === monthIndex).length;

      return {
        month: monthLabel,
        active: activeCount,
        new: newAdditionsCount
      };
    });
  };

  const exportCSV = () => {
    if (requests.length === 0) {
      alert('No requests available to export.');
      return;
    }
    const headers = 'ID,Patient Name,Blood Group,Units Needed,Hospital,Urgency,Status,Date\n';
    const rows = requests.map(r => 
      `${r.id},"${r.patient_name}",${r.blood_group},${r.units},"${r.hospital}",${r.urgency},${r.status},${r.date}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blood-requests-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <Button variant="outline" className="gap-2" onClick={exportCSV} disabled={loading}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Blood Requests per Month</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getMonthlyRequestsData()}>
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
                <LineChart data={getDonorActivityData()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="hsl(0, 72%, 51%)" strokeWidth={2} name="Active Pool" />
                  <Line type="monotone" dataKey="new" stroke="hsl(142, 71%, 45%)" strokeWidth={2} name="New Donors" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
