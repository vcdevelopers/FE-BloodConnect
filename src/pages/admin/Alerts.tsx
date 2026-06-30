import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS, MUMBAI_ZONES, mockAlerts } from '@/lib/mock-data';
import { Bell, Send, MessageSquare, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const channelIcons = { sms: MessageSquare, whatsapp: MessageSquare, email: Mail, push: Bell };

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<any[]>(mockAlerts);
  const [bloodGroup, setBloodGroup] = useState('All');
  const [zone, setZone] = useState('All');
  const [channel, setChannel] = useState('sms');
  const [message, setMessage] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const [donors, setDonors] = useState<any[]>([]);
  const [selectedDonorIds, setSelectedDonorIds] = useState<string[]>([]);
  
  useEffect(() => {
    fetch('/api/donors/')
      .then(res => res.json())
      .then(data => {
        setDonors(data);
      })
      .catch(err => console.error('Error fetching donors:', err));
  }, []);

  const matchingDonors = donors.filter(d => {
    if (bloodGroup !== 'All' && d.blood_group !== bloodGroup) return false;
    if (zone !== 'All' && d.zone !== zone) return false;
    return true;
  });

  useEffect(() => {
    setSelectedDonorIds(matchingDonors.map(d => String(d.id)));
  }, [bloodGroup, zone, donors]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (selectedDonorIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No Recipients Selected",
        description: "Please select at least one recipient to send the alert.",
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/alerts/broadcast/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloodGroup,
          zone,
          channel,
          message,
          templateId,
          recipientIds: selectedDonorIds.map(id => parseInt(id)),
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const newAlert = {
          id: String(alerts.length + 1),
          message,
          type: channel as 'sms' | 'whatsapp' | 'email' | 'push',
          bloodGroup: bloodGroup === 'All' ? undefined : bloodGroup,
          zone: zone === 'All' ? undefined : zone,
          recipients: data.recipients,
          sentAt: 'Just now',
          status: 'sent' as const
        };

        setAlerts([newAlert, ...alerts]);
        toast({
          title: "Alert Broadcasted",
          description: data.message || `Alert sent successfully to ${data.recipients} donors.`,
        });
        setMessage('');
        setTemplateId('');
      } else {
        throw new Error(data.message || 'Failed to dispatch broadcast alert.');
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Broadcast Failed",
        description: err.message || "Failed to connect to broadcast service.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Alert Management</h2>

      {/* Send New Alert */}
      <Card>
        <CardHeader><CardTitle>Send New Alert</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Target Blood Group</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger><SelectValue placeholder="All groups" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Groups</SelectItem>
                    {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Zone</Label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger><SelectValue placeholder="All zones" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Zones</SelectItem>
                    {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Channel</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger><SelectValue placeholder="Select channel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recipients Selection List */}
            <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm font-semibold">Select Recipients ({matchingDonors.length} found)</span>
                {matchingDonors.length > 0 && (
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedDonorIds(matchingDonors.map(d => String(d.id)))}
                      className="text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Select All
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDonorIds([])}
                      className="text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Deselect All
                    </button>
                  </div>
                )}
              </div>
              
              {matchingDonors.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 text-center">No active donors match the selected filters.</p>
              ) : (
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
                  {matchingDonors.map((donor) => {
                    const isChecked = selectedDonorIds.includes(String(donor.id));
                    return (
                      <label key={donor.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/40 transition-colors cursor-pointer border text-xs bg-card">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedDonorIds(selectedDonorIds.filter(id => id !== String(donor.id)));
                            } else {
                              setSelectedDonorIds([...selectedDonorIds, String(donor.id)]);
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-foreground">{donor.name}</span>
                            <span className="text-muted-foreground ml-2">({donor.blood_group} • {donor.zone})</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {channel === 'email' ? (donor.email || 'No email') : (donor.phone || 'No phone')}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <Label>Message</Label>
              <Textarea 
                placeholder="Type your alert message..." 
                rows={3} 
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>
            {channel === 'sms' && (
              <div>
                <Label htmlFor="sms-template-id">DLT Template ID</Label>
                <Input
                  id="sms-template-id"
                  placeholder="e.g. 1000123456789012345"
                  value={templateId}
                  onChange={e => setTemplateId(e.target.value)}
                  className="max-w-md"
                  required
                />
              </div>
            )}
            <Button type="submit" className="gap-2" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Broadcasting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Alert
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader><CardTitle>Alert History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((a) => {
              const Icon = channelIcons[a.type as keyof typeof channelIcons] || Bell;
              return (
                <div key={a.id} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{a.message}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{a.type.toUpperCase()}</Badge>
                      {a.bloodGroup && <Badge variant="outline">{a.bloodGroup}</Badge>}
                      {a.zone && <Badge variant="outline">{a.zone}</Badge>}
                      <span>{a.recipients} recipients</span>
                      <span>• {a.sentAt}</span>
                    </div>
                  </div>
                  <Badge variant={a.status === 'sent' ? 'default' : 'secondary'}>{a.status}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
