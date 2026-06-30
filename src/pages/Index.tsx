import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Droplets, Users, Activity, Calendar, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockStats, mockCampaigns } from '@/lib/mock-data';

const steps = [
  { step: 1, title: 'Search Blood', description: 'Find available blood in hospitals and blood banks near you.', icon: Search },
  { step: 2, title: 'Submit Request', description: 'Submit a blood request for emergency needs and find matches.', icon: Heart },
  { step: 3, title: 'Contact Bank', description: 'Connect with the blood bank directly to obtain the units.', icon: CheckCircle },
];

export default function Index() {
  const [statsData, setStatsData] = useState(mockStats);
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      fetch('/api/stats/')
        .then(res => res.json())
        .then(data => {
          setStatsData(data);
        })
        .catch(err => console.error('Error fetching stats:', err));
    };

    const loadCamps = () => {
      fetch('/api/camps/')
        .then(res => res.json())
        .then(data => {
          setCamps(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching camps:', err);
          setLoading(false);
        });
    };

    loadStats();
    loadCamps();

    const statsInterval = setInterval(loadStats, 5000);
    const campsInterval = setInterval(loadCamps, 5000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(campsInterval);
    };
  }, []);

  const stats = [
    { label: 'Registered Donors', value: statsData.totalDonors.toLocaleString(), icon: Users, color: 'text-primary' },
    { label: 'Requests Today', value: statsData.requestsToday, icon: Activity, color: 'text-warning' },
    { label: 'Units Available', value: statsData.unitsAvailable, icon: Droplets, color: 'text-success' },
    { label: 'Active Campaigns', value: statsData.activeCampaigns, icon: Calendar, color: 'text-accent' },
  ];

  const displayedCamps = camps.length > 0 ? camps.slice(0, 3) : mockCampaigns.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Droplets className="h-4 w-4" /> Mumbai's Blood Donation Platform
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Find Blood. Save Lives.{' '}
              <span className="text-primary">Support Mumbai.</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Connect with verified blood donors, search real-time availability, and request emergency blood — all in one platform built for Mumbai.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/search">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <Search className="h-5 w-5" /> Search Blood
                </Button>
              </Link>
              <Link to="/request">
                <Button size="lg" variant="destructive" className="w-full gap-2 sm:w-auto">
                  <Heart className="h-5 w-5 fill-current" /> Request Blood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Three simple steps to save a life</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <s.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-1 text-sm font-bold text-primary">Step {s.step}</div>
                <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Blood Donation Camps */}
      {camps.filter(c => c.status === 'upcoming').length > 0 && (
        <section className="py-16 bg-muted/30 border-t">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">Upcoming Blood Donation Camps</h2>
              <p className="mt-2 text-muted-foreground">Find and register for active blood donation drives near you in Mumbai</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {camps.filter(c => c.status === 'upcoming').map((c) => (
                <Card key={c.id} className="overflow-hidden border shadow-md hover:shadow-lg transition-shadow bg-card/60 backdrop-blur">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-2 bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                        <Calendar className="h-3 w-3" /> {c.date}
                      </div>
                      <h3 className="font-bold text-lg leading-tight text-foreground">{c.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.description || 'No description provided.'}</p>
                    </div>
                    <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Location:</span> {c.location} • {c.zone}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Time:</span> {c.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Organizer:</span> {c.organizer}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
