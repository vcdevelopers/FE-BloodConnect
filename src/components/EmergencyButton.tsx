import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function EmergencyButton() {
  return (
    <Link
      to="/request"
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-2xl animate-pulse-emergency transition-transform active:scale-95 hover:scale-105 lg:bottom-6 lg:right-6"
      aria-label="Emergency Blood Request"
    >
      <Heart className="h-5 w-5 fill-current" />
      <span className="text-sm font-bold">SOS</span>
    </Link>
  );
}
