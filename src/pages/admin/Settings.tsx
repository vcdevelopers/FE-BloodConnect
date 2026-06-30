import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <Card>
        <CardHeader><CardTitle>Platform Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Emergency Contact Number</Label>
            <Input defaultValue="+91 22 1234 5678" />
          </div>
          <div>
            <Label>Donor Alert Radius (km)</Label>
            <Input type="number" defaultValue={15} />
          </div>
          <div>
            <Label>Male Donation Gap (days)</Label>
            <Input type="number" defaultValue={90} />
          </div>
          <div>
            <Label>Female Donation Gap (days)</Label>
            <Input type="number" defaultValue={120} />
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
