import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function EmergencyButton() {
  return (
    <Link
      to="/request"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg animate-pulse-emergency transition-transform hover:scale-110 md:h-auto md:w-auto md:gap-2 md:rounded-full md:px-5 md:py-3"
      aria-label="Emergency Blood Request"
    >
      <Heart className="h-6 w-6 fill-current" />
      <span className="hidden md:inline text-sm font-bold">Emergency Request</span>
    </Link>
  );
}
