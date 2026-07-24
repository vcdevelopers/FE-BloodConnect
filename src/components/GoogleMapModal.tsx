import { MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface GoogleMapModalProps {
  query: string;
  title: string;
  className?: string;
}

export function GoogleMapModal({ query, title, className }: GoogleMapModalProps) {
  // Using the classic Google Maps embed URL which doesn't require specific API activation
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline mt-1.5 transition-colors cursor-pointer border-none bg-transparent p-0 text-left ${className || ''}`}>
          <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
          <span>View this on Google Map</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[400px]">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={embedUrl}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
