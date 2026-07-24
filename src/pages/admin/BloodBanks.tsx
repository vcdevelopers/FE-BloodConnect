import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Droplets, RefreshCw, Search, ChevronDown, ChevronUp, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BLOOD_GROUPS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { getGoogleMapsUrl, getGoogleMapsQuery } from '../SearchBlood';
import { GoogleMapModal } from '@/components/GoogleMapModal';
import { GoogleAddressText } from '@/components/GoogleAddressText';
export default function AdminBloodBanks() {
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  // Search and Collapsible States
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBanks, setExpandedBanks] = useState<Record<string, boolean>>({});

  const toggleExpandBank = (bankId: string) => {
    setExpandedBanks(prev => ({
      ...prev,
      [bankId]: !prev[bankId]
    }));
  };

  const fetchBloodBanks = () => {
    fetch('/api/bloodbanks/')
      .then(res => res.json())
      .then(data => {
        setBloodBanks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBloodBanks();
    const interval = setInterval(fetchBloodBanks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncStock = () => {
    setSyncing(true);
    fetch('/api/bloodbanks/refresh/', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Sync failed');
        toast({
          title: "Sync Success",
          description: "Live blood bank stocks successfully synced from MahaSBTC!",
        });
        fetchBloodBanks();
        setSyncing(false);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Sync Failed",
          description: "Failed to scrape latest stocks from the portal. Please try again.",
        });
        setSyncing(false);
      });
  };

  const getAggregatedInventory = (inventory: any[]) => {
    const map: Record<string, { group: string; component: string; units: number }> = {};

    const bloodComponents = ['Whole Blood', 'PRBC'];
    BLOOD_GROUPS.forEach(g => {
      bloodComponents.forEach(comp => {
        const key = `${comp}::${g}`;
        map[key] = { group: g, component: comp, units: 0 };
      });
    });

    const specialComponents = [
      'Single Donor Platelets',
      'Random Donor Platelets (RDP)',
      'Fresh Frozen Plasma (FFP)',
      'Liquid Plasma',
      'Single Donor Plasma',
      'Cryoprecipitate',
      'Bombay Blood Group (+)',
      'Bombay Blood Group (-)',
    ];
    specialComponents.forEach(comp => {
      map[`special::${comp}`] = { group: comp, component: comp, units: 0 };
    });

    if (inventory) {
      inventory.forEach(item => {
        if (item.group === 'All') {
          const key = `special::${item.component}`;
          if (map[key] !== undefined) {
            map[key].units += item.units || 0;
          }
        } else {
          const comp = item.component || 'Whole Blood';
          const key = `${comp}::${item.group}`;
          if (map[key] !== undefined) {
            map[key].units += item.units || 0;
          }
        }
      });
    }

    return Object.values(map).map(({ group, component, units }) => ({
      group,
      component,
      units,
      label: component === 'Whole Blood' || component === 'PRBC'
        ? `${group} (${component})`
        : group,
    }));
  };

  const filteredBloodBanks = bloodBanks.filter(bb => 
    (bb.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bb.location || bb.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bb.zone || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Blood Bank Management</h2>
        <div className="flex items-center gap-3">
          <Button onClick={handleSyncStock} disabled={syncing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Stock'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-xl border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by hospital name, zone, or district..." 
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredBloodBanks.length} of {bloodBanks.length} blood banks
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredBloodBanks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No matching blood banks found.</p>
          </CardContent>
        </Card>
      ) : (
        filteredBloodBanks.map((bb) => {
          const aggInv = getAggregatedInventory(bb.inventory);
          const availableInv = aggInv.filter(inv => inv.units > 0);
          const unavailableInv = aggInv.filter(inv => inv.units === 0);
          const isExpanded = !!expandedBanks[bb.id];

          return (
            <Card key={bb.id} className="overflow-hidden border shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-foreground">{bb.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    <GoogleAddressText 
                      query={getGoogleMapsQuery(bb)} 
                      fallback={getGoogleMapsQuery(bb)} 
                    /> • <span className="font-medium text-foreground/75">{bb.zone || 'Nearby'}</span> • Contact: {bb.contact || '+91 22 2640 0000'}
                  </p>
                  <div className="mt-1.5">
                    <GoogleMapModal query={getGoogleMapsQuery(bb)} title={bb.name || 'Location'} />
                  </div>
                </div>

                {/* Available Inventory Section */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Available Stock
                  </h4>
                  {availableInv.length === 0 ? (
                    <p className="text-sm text-amber-600 flex items-center gap-1.5 font-medium py-1">
                      <AlertTriangle className="h-4 w-4" /> No blood units currently available. Click "Sync Stock" or update manually.
                    </p>
                  ) : (
                    <div className="rounded-md border divide-y text-sm overflow-hidden bg-background max-w-md">
                      {availableInv.map((inv) => (
                        <div key={inv.label} className="flex items-center justify-between px-3 py-1.5 hover:bg-muted/30 transition-colors">
                          <span className="text-foreground/75 text-xs">{inv.label}</span>
                          <span className="font-semibold text-foreground text-xs tabular-nums">{inv.units} units</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Out of Stock Collapsible Section */}
                {unavailableInv.length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <button 
                      onClick={() => toggleExpandBank(bb.id)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors p-0 h-auto gap-1 flex items-center bg-transparent border-0 outline-none"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" /> Hide {unavailableInv.length} out-of-stock groups
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" /> Show {unavailableInv.length} out-of-stock groups
                        </>
                      )}
                    </button>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {unavailableInv.map((inv) => (
                          <Badge 
                            key={inv.label} 
                            variant="outline" 
                            className="text-muted-foreground/60 border-muted text-[10px] px-2 py-0.5"
                          >
                            {inv.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
