import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Droplets, RefreshCw, Search, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BLOOD_GROUPS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

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
    const map: Record<string, number> = {};
    
    // Seed standard blood groups to 0 so they always show
    BLOOD_GROUPS.forEach(g => {
      map[g] = 0;
    });

    // Also seed Platelets and Plasma defaults
    map['Single Donor Platelets'] = 0;
    map['Random Donor Platelets (RDP)'] = 0;
    map['Fresh Frozen Plasma (FFP)'] = 0;
    map['Liquid Plasma'] = 0;
    map['Single Donor Plasma'] = 0;
    map['Cryoprecipitate'] = 0;
    
    if (inventory) {
      inventory.forEach(item => {
        let key = item.group;
        if (key === 'All') {
          key = item.component;
        }
        if (key) {
          map[key] = (map[key] || 0) + (item.units || 0);
        }
      });
    }

    return Object.entries(map).map(([group, units]) => ({ group, units }));
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
                    {bb.location || bb.district} • <span className="font-medium text-foreground/75">{bb.zone || 'Nearby'}</span> • Contact: {bb.contact || '+91 22 2640 0000'}
                  </p>
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
                    <div className="flex flex-wrap gap-2">
                      {availableInv.map((inv) => {
                        const isComponent = inv.group.includes('Platelets') || inv.group.includes('Plasma') || inv.group === 'Cryoprecipitate';
                        let badgeClass = "";
                        
                        if (isComponent) {
                          // Style for Platelets / Plasma components
                          badgeClass = "bg-violet-600 hover:bg-violet-700 text-white border-transparent gap-1 px-2.5 py-1 text-xs font-medium";
                        } else if (inv.units < 10) {
                          // Critical stock for standard blood groups
                          badgeClass = "bg-red-500 hover:bg-red-600 text-white border-transparent gap-1 px-2.5 py-1 text-xs font-medium";
                        } else {
                          // Normal/Healthy stock for standard blood groups
                          badgeClass = "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent gap-1 px-2.5 py-1 text-xs font-medium";
                        }

                        return (
                          <Badge 
                            key={inv.group} 
                            className={badgeClass}
                          >
                            <Droplets className="h-3 w-3 fill-current" /> {inv.group}: {inv.units} units
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Out of Stock Collapsible Section */}
                {unavailableInv.length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <button 
                      onClick={() => toggleExpandBank(bb.id)}
                      className="text-xs text-muted-foreground hover:text-primary hover:bg-transparent transition-colors p-0 h-auto gap-1 flex items-center bg-transparent border-0 outline-none"
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
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {unavailableInv.map((inv) => (
                          <Badge 
                            key={inv.group} 
                            variant="outline" 
                            className="text-[10px] text-muted-foreground/70 border-dashed opacity-75 gap-0.5"
                          >
                            {inv.group}: 0 units
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
