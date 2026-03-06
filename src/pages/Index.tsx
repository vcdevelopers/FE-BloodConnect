import { Link } from 'react-router-dom';
import { Search, Heart, Droplets, Users, Activity, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockStats, mockCampaigns } from '@/lib/mock-data';

const stats = [
  { label: 'Registered Donors', value: mockStats.totalDonors.toLocaleString(), icon: Users, color: 'text-primary' },
  { label: 'Requests Today', value: mockStats.requestsToday, icon: Activity, color: 'text-warning' },
  { label: 'Units Available', value: mockStats.unitsAvailable, icon: Droplets, color: 'text-success' },
  { label: 'Active Campaigns', value: mockStats.activeCampaigns, icon: Calendar, color: 'text-accent' },
];

const steps = [
  { step: 1, title: 'Search Blood', description: 'Find available blood in hospitals and blood banks near you.', icon: Search },
  { step: 2, title: 'Request or Donate', description: 'Submit a blood request or register as a donor to help others.', icon: Heart },
  { step: 3, title: 'Save Lives', description: 'Your donation reaches the patient and saves a life.', icon: CheckCircle },
];

export default function Index() {
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
              <Link to="/donate">
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  <Droplets className="h-5 w-5" /> Donate Blood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className={`mx-auto mb-2 h-8 w-8 ${stat.color}`} />
                  <div className="text-3xl font-extrabold">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
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

      {/* Upcoming Camps */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Upcoming Blood Camps</h2>
              <p className="mt-1 text-muted-foreground">Register and donate near you</p>
            </div>
            <Link to="/camps" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCampaigns.slice(0, 3).map((camp) => (
              <Card key={camp.id} className="overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardContent className="p-5">
                  <div className="mb-2 text-xs font-medium text-primary">{camp.date} • {camp.time}</div>
                  <h3 className="mb-1 text-lg font-bold">{camp.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{camp.organizer} • {camp.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{camp.slotsBooked}/{camp.slots} registered</span>
                    <Link to={`/camps/${camp.id}`}>
                      <Button size="sm" variant="outline">Register</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link to="/camps" className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden">
            View All Camps <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <Card className="overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">Become a Lifesaver Today</h2>
              <p className="mx-auto mb-6 max-w-xl text-primary-foreground/80">
                Register as a blood donor and join thousands of Mumbaikars who are ready to help in emergencies. Your blood can save up to 3 lives.
              </p>
              <Link to="/donate">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Heart className="h-5 w-5" /> Register as Donor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
