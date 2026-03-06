import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS, MUMBAI_ZONES, mockAlerts } from '@/lib/mock-data';
import { Bell, Send, MessageSquare, Mail } from 'lucide-react';

const channelIcons = { sms: MessageSquare, whatsapp: MessageSquare, email: Mail, push: Bell };

export default function AdminAlerts() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Alert Management</h2>

      {/* Send New Alert */}
      <Card>
        <CardHeader><CardTitle>Send New Alert</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Target Blood Group</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="All groups" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Zone</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="All zones" /></SelectTrigger>
                  <SelectContent>
                    {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Channel</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select channel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea placeholder="Type your alert message..." rows={3} />
            </div>
            <Button className="gap-2"><Send className="h-4 w-4" /> Send Alert</Button>
          </form>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader><CardTitle>Alert History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((a) => {
              const Icon = channelIcons[a.type];
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
