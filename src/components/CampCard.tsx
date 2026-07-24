import { Calendar, Clock, MapPin, Users, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoogleMapModal } from '@/components/GoogleMapModal';

export interface Camp {
  id: number;
  name: string;
  organizer: string;
  location: string;
  zone: string;
  date: string;
  time: string;
  slots: number;
  slots_booked?: number;
  slotsBooked?: number;
  description: string;
  image: string | null;
  google_maps_link: string | null;
  contact_person: string | null;
  contact_number: string | null;
  blood_groups_needed: string | null;
  registration_link: string | null;
}

interface CampCardProps {
  camp: Camp;
  bookingId: number | string | null;
  handleRegister: (campId: number) => void;
}

export function CampCard({ camp, bookingId, handleRegister }: CampCardProps) {
  const booked = camp.slots_booked !== undefined ? camp.slots_booked : camp.slotsBooked || 0;
  const pct = Math.round((booked / camp.slots) * 100);
  const isFull = booked >= camp.slots;

  const getImageUrl = (url: string | null) => {
    if (!url) return '/placeholder_camp.png';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        return parsed.pathname;
      } catch (e) {
        return url;
      }
    }
    return url;
  };

  return (
    <Card className="overflow-hidden border shadow-md flex flex-col h-full bg-white dark:bg-slate-900/60 backdrop-blur-md">
      {/* Banner Image with Upcoming status badge overlaid */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 border-b">
        <img 
          src={getImageUrl(camp.image)} 
          alt={camp.name} 
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder_camp.png';
          }}
        />
        <Badge className="absolute top-3 right-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm">
          Upcoming
        </Badge>
      </div>

      <CardContent className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
              {camp.zone}
            </Badge>
            
            {camp.blood_groups_needed && (
              <Badge variant="destructive" className="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/50 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400 font-bold px-2 py-0.5">
                Needs: {camp.blood_groups_needed}
              </Badge>
            )}
          </div>

          <h3 className="mb-1 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">{camp.name}</h3>
          <p className="mb-3 text-xs font-semibold text-slate-500">{camp.organizer}</p>
          
          <div className="mb-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />{camp.date}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" />{camp.time}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{camp.location}</div>
          </div>

          {/* Google Maps link */}
          <div className="mb-4">
            {camp.google_maps_link ? (
              <a 
                href={camp.google_maps_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline"
              >
                <MapPin className="h-3.5 w-3.5" /> View this on Google Map <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <GoogleMapModal 
                query={`${camp.name}, ${camp.location}, ${camp.zone || 'Mumbai'}, Maharashtra`} 
                title={camp.name || 'Camp Location'} 
                className="font-bold dark:text-rose-400 mt-0"
              />
            )}
          </div>

          {camp.description && (
            <p className="mb-4 text-xs text-muted-foreground leading-relaxed italic min-h-[36px] line-clamp-3">
              "{camp.description}"
            </p>
          )}

          {/* Contact Info */}
          {(camp.contact_person || camp.contact_number) && (
            <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              {camp.contact_person && (
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Organizer Contact:</span> {camp.contact_person}
                </div>
              )}
              {camp.contact_number && (
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Contact Number:</span> {camp.contact_number}
                </div>
              )}
            </div>
          )}
        </div>

        {(camp.google_maps_link || camp.registration_link) && (
          <div className="flex gap-2.5 mt-auto pt-3">
            {camp.google_maps_link && (
              <Button
                variant="outline"
                className="flex-grow flex-1 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/40 dark:text-rose-400 font-semibold text-xs"
                onClick={() => window.open(camp.google_maps_link, '_blank')}
              >
                <MapPin className="h-4 w-4" /> Open in Maps
              </Button>
            )}
            
            {camp.registration_link && (
              <Button 
                className="flex-grow flex-1 gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs" 
                onClick={() => window.open(camp.registration_link, '_blank')}
              >
                <ExternalLink className="h-4 w-4" /> Register Now
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
