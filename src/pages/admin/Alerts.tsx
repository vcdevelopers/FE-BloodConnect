import { useState } from 'react';
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
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);

    setTimeout(() => {
      const newAlert = {
        id: String(alerts.length + 1),
        message,
        type: channel as 'sms' | 'whatsapp' | 'email' | 'push',
        bloodGroup: bloodGroup === 'All' ? undefined : bloodGroup,
        zone: zone === 'All' ? undefined : zone,
        recipients: Math.floor(Math.random() * 45) + 5,
        sentAt: 'Just now',
        status: 'sent' as const
      };

      setAlerts([newAlert, ...alerts]);
      toast({
        title: "Alert Broadcasted",
        description: `Alert sent to ${newAlert.recipients} recipients via ${channel.toUpperCase()}`,
      });
      setMessage('');
      setSending(false);
    }, 1200);
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
