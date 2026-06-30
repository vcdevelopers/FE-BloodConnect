import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Loader2, ChevronDown, ChevronUp, AlertTriangle, Clock, RefreshCw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS, MUMBAI_ZONES } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const formatTimestamp = (ts: string | null | undefined): string => {
  if (!ts) return 'Unknown';
  try {
    const date = new Date(ts);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  } catch {
    return 'Unknown';
  }
};

export default function SearchBlood() {
  const [hospitalName, setHospitalName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('ALL');
  const [zone, setZone] = useState('ALL');
  const [pincode, setPincode] = useState('');
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [searched, setSearched] = useState(false);
  const [expandedBanks, setExpandedBanks] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const [requestModalOpen, setRequestModalOpen] = useState<string | null>(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [dialogPatientName, setDialogPatientName] = useState('');
  const [dialogBloodGroup, setDialogBloodGroup] = useState('');
  const [dialogUnits, setDialogUnits] = useState('1');
  const [dialogUrgency, setDialogUrgency] = useState('Normal');
  const [dialogPhone, setDialogPhone] = useState('');
  const [dialogAttendant, setDialogAttendant] = useState('');

  const openRequestModal = (bb: any) => {
    setDialogPatientName('');
    setDialogBloodGroup(bloodGroup !== 'ALL' ? bloodGroup : '');
    setDialogUnits('1');
    setDialogUrgency('Normal');
    setDialogPhone('');
    setDialogAttendant('');
    setRequestModalOpen(bb.id);
  };

  const handleDialogSubmit = (e: React.FormEvent, bb: any) => {
    e.preventDefault();
    if (!dialogPatientName || !dialogBloodGroup || !dialogUnits || !dialogUrgency || !dialogPhone || !dialogAttendant) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }
    setSubmittingRequest(true);

    const payload = {
      patient_name: dialogPatientName,
      blood_group: dialogBloodGroup,
      units: parseInt(dialogUnits) || 1,
      urgency: dialogUrgency,
      hospital: bb.name,
      hospital_address: bb.location || bb.district || 'Mumbai',
      attendant_name: dialogAttendant,
      phone: dialogPhone,
      status: 'pending'
    };

    fetch('/api/requests/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(() => {
        toast({
          title: '✅ Request Submitted!',
          description: `Blood request for ${dialogPatientName} submitted to ${bb.name}.`,
        });
        setRequestModalOpen(null);
        setSubmittingRequest(false);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Request Failed',
          description: 'Could not submit blood request. Please check inputs and try again.',
        });
        setSubmittingRequest(false);
      });
  };

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

  const handleSync = () => {
    setSyncing(true);
    fetch('/api/bloodbanks/refresh/', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Sync failed');
        toast({
          title: '✅ Synced Successfully',
          description: 'Latest blood stock data fetched from MahaSBTC portal.',
        });
        fetchBloodBanks();
        setLastSynced(new Date());
        setSyncing(false);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Sync Failed',
          description: 'Could not reach MahaSBTC. Please try again.',
        });
        setSyncing(false);
      });
  };

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const getAggregatedInventory = (inventory: any[]) => {
    // Use component+group as the unique key so WB and PRBC are shown separately
    const map: Record<string, { group: string; component: string; units: number }> = {};

    // Seed blood groups for both WB and PRBC with 0 so they always appear
    const bloodComponents = ['Whole Blood', 'PRBC'];
    BLOOD_GROUPS.forEach(g => {
      bloodComponents.forEach(comp => {
        const key = `${comp}::${g}`;
        map[key] = { group: g, component: comp, units: 0 };
      });
    });

    // Seed special components
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
          // Special components
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

  const results = bloodBanks.filter((bb) => {
    if (hospitalName && !(bb.name || '').toLowerCase().includes(hospitalName.toLowerCase())) return false;
    if (bloodGroup && bloodGroup !== 'ALL') {
      const agg = getAggregatedInventory(bb.inventory);
      // Check if ANY component entry for this blood group has units > 0
      const hasStock = agg.some(item => item.group.toLowerCase() === bloodGroup.toLowerCase() && item.units > 0);
      if (!hasStock) return false;
    }
    if (zone && zone !== 'ALL' && bb.zone?.toLowerCase() !== zone.toLowerCase() && bb.district?.toLowerCase() !== zone.toLowerCase()) return false;
    if (pincode && (bb.pincode?.toString().replace(/\s+/g, '') !== pincode.replace(/\s+/g, ''))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Search Blood Availability
            </h1>
            <p className="text-sm text-muted-foreground">
              Find verified blood stock and contact blood banks in Mumbai
            </p>
            {lastSynced && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Clock className="h-3.5 w-3.5" />
                Last sync: {lastSynced.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
            className="w-fit shrink-0 gap-2 border-primary/20 hover:bg-primary/5"
          >
            {syncing
              ? <><Loader2 className="h-4 w-4 animate-spin text-primary" /> Syncing…</>
              : <><RefreshCw className="h-4 w-4 text-primary" /> Sync Live Data</>}
          </Button>
        </div>

        {/* Filters */}
        <Card className="border shadow-md bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <Label>Hospital / Blood Bank</Label>
                <Input 
                  placeholder="e.g. Holy Spirit, Kikabai..." 
                  value={hospitalName} 
                  onChange={e => setHospitalName(e.target.value)} 
                />
              </div>
              <div>
                <Label>Blood Group</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger><SelectValue placeholder="All Blood Groups" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Blood Groups</SelectItem>
                    {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Area / Zone</Label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger><SelectValue placeholder="All Areas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Areas</SelectItem>
                    {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pincode</Label>
                <Input 
                  placeholder="e.g. 400050" 
                  value={pincode} 
                  onChange={e => setPincode(e.target.value)} 
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full gap-2" onClick={() => setSearched(true)}>
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : results.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground">
            <Search className="mx-auto mb-4 h-12 w-12 opacity-20" />
            <p className="text-lg font-medium">No blood banks found</p>
            <p className="text-sm">Try a different pincode, zone, or blood group filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((bb) => {
              const aggInv = getAggregatedInventory(bb.inventory);
              // Show only selected group if filter is applied (and not 'ALL'), otherwise show all
              const displayedInventory = (bloodGroup && bloodGroup !== 'ALL')
                ? aggInv.filter(i => i.group.toLowerCase() === bloodGroup.toLowerCase())
                : aggInv;
              // Use unique label as the key for react rendering

              const availableInv = displayedInventory.filter(inv => inv.units > 0);
              const unavailableInv = displayedInventory.filter(inv => inv.units === 0);
              const isExpanded = !!expandedBanks[bb.id];

              return (
                <Card key={bb.id} className="overflow-hidden border shadow-sm">
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div>
                      <div className="mb-4">
                        {/* Data freshness banner */}
                        {bb.timestamp && (
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border rounded px-2 py-1 mb-2 w-fit">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>Hospital data as of <strong>{formatTimestamp(bb.timestamp)}</strong></span>
                          </div>
                        )}
                        <h3 className="font-bold text-lg text-foreground">{bb.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                          <MapPin className="h-4 w-4 text-primary/75" /> {bb.location || bb.district} • {bb.distance || 'Nearby'}
                        </div>
                      </div>
                                            {/* Inventory Section */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Available Stock
                        </h4>
                        {availableInv.length === 0 ? (
                          <p className="text-sm text-amber-600 flex items-center gap-1.5 font-medium py-1">
                            <AlertTriangle className="h-4 w-4" /> No blood units currently available.
                          </p>
                        ) : (
                          <div className="rounded-md border divide-y text-sm overflow-hidden">
                            {availableInv.map((inv) => (
                              <div key={inv.label} className="flex items-center justify-between px-3 py-1.5 hover:bg-muted/30 transition-colors">
                                <span className="text-foreground/75 text-xs">{inv.label}</span>
                                <span className="font-semibold text-foreground text-xs tabular-nums">{inv.units} units</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Collapsible Out of Stock */}
                      {unavailableInv.length > 0 && (
                        <div className="mb-4 pt-3 border-t">
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
                                  className="text-[10px] text-muted-foreground/70 border-dashed opacity-75 gap-0.5"
                                >
                                  {inv.label}: 0 units
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" /> {bb.contact || '+91 22 2640 0000'}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Request Blood Dialog Modal */}
                        <Dialog open={requestModalOpen === bb.id} onOpenChange={(isOpen) => isOpen ? openRequestModal(bb) : setRequestModalOpen(null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">Request Blood</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-left">Request Blood from {bb.name}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => handleDialogSubmit(e, bb)} className="space-y-4 pt-4 text-left">
                              <div>
                                <Label htmlFor="dialog-patient">Patient Name *</Label>
                                <Input 
                                  id="dialog-patient" 
                                  placeholder="Patient's full name" 
                                  value={dialogPatientName}
                                  onChange={e => setDialogPatientName(e.target.value)}
                                  required 
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Blood Group *</Label>
                                  <Select value={dialogBloodGroup} onValueChange={setDialogBloodGroup} required>
                                    <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                                    <SelectContent>
                                      {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="dialog-units">Units Needed *</Label>
                                  <Input 
                                    id="dialog-units" 
                                    type="number" 
                                    min={1} 
                                    max={10} 
                                    value={dialogUnits}
                                    onChange={e => setDialogUnits(e.target.value)}
                                    required 
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Urgency Level *</Label>
                                  <Select value={dialogUrgency} onValueChange={setDialogUrgency} required>
                                    <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Normal">Normal</SelectItem>
                                      <SelectItem value="Urgent">Urgent</SelectItem>
                                      <SelectItem value="Emergency">Emergency</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="dialog-phone">Mobile Number *</Label>
                                  <Input 
                                    id="dialog-phone" 
                                    placeholder="+91 xxxxx xxxxx" 
                                    value={dialogPhone}
                                    onChange={e => setDialogPhone(e.target.value)}
                                    required 
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="dialog-attendant">Attendant Name *</Label>
                                <Input 
                                  id="dialog-attendant" 
                                  placeholder="Contact person name" 
                                  value={dialogAttendant}
                                  onChange={e => setDialogAttendant(e.target.value)}
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="dialog-hospital">Hospital Name</Label>
                                <Input id="dialog-hospital" value={bb.name} disabled className="bg-muted" />
                              </div>
                              <div>
                                <Label htmlFor="dialog-hospital-addr">Hospital Address</Label>
                                <Input id="dialog-hospital-addr" value={bb.location || bb.district || ''} disabled className="bg-muted" />
                              </div>
                              <Button type="submit" className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-white font-medium" disabled={submittingRequest}>
                                {submittingRequest ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Heart className="h-4 w-4 fill-current" /> Submit Request</>}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <a href={`tel:${bb.contact || '+91 22 2640 0000'}`}>
                          <Button size="sm">Call Bank</Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}



      </div>
    </div>
  );
}
