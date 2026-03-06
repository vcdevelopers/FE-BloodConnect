import { useState, useEffect } from 'react';
import { Download, Droplets, Smartphone, Share, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <Card className="max-w-sm text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Already Installed!</h2>
            <p className="text-sm text-muted-foreground">You're using Mumbai Blood Connect as an app.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            <Droplets className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Install Mumbai Blood Connect</h1>
          <p className="text-muted-foreground">Get instant access to blood search, emergency requests, and donor alerts right from your home screen.</p>
        </div>

        {/* Android / Chrome install */}
        {deferredPrompt && !installed && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Button size="lg" className="w-full gap-2 h-14 text-base" onClick={handleInstall}>
                <Download className="h-5 w-5" /> Install App Now
              </Button>
            </CardContent>
          </Card>
        )}

        {installed && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Check className="h-6 w-6 text-success" />
              </div>
              <p className="font-semibold">App installed successfully!</p>
            </CardContent>
          </Card>
        )}

        {/* iOS instructions */}
        {isIOS && !deferredPrompt && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-bold">Install on iPhone / iPad</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">1</div>
                  <div>
                    <p className="font-medium">Tap the Share button</p>
                    <p className="text-sm text-muted-foreground">Look for the <Share className="inline h-4 w-4" /> icon at the bottom of Safari</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">2</div>
                  <div>
                    <p className="font-medium">Tap "Add to Home Screen"</p>
                    <p className="text-sm text-muted-foreground">Scroll down and look for <Plus className="inline h-4 w-4" /> Add to Home Screen</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">3</div>
                  <div>
                    <p className="font-medium">Tap "Add"</p>
                    <p className="text-sm text-muted-foreground">The app will appear on your home screen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid gap-3">
          {[
            { icon: '🔍', title: 'Instant Blood Search', desc: 'Find available blood in seconds' },
            { icon: '🚨', title: 'Emergency SOS', desc: 'One-tap emergency blood request' },
            { icon: '📱', title: 'Works Offline', desc: 'Access key features without internet' },
            { icon: '🔔', title: 'Donor Alerts', desc: 'Get notified when your blood type is needed' },
          ].map((f) => (
            <Card key={f.title}>
              <CardContent className="flex items-center gap-4 p-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
