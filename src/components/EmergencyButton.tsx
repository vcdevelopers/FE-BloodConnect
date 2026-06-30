import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function EmergencyButton() {
  return (
    <Link
      to="/request"
      className="fixed bottom-20 right-4 z-50 flex items-center gap-1.5 rounded-full bg-[#d32f2f] text-white px-6 py-2.5 shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 lg:bottom-8 lg:right-8 border-[6px] border-[#d32f2f]/15 hover:border-[#d32f2f]/25"
      aria-label="Emergency Blood Request"
    >
      <Heart className="h-4.5 w-4.5 fill-current text-white" />
      <span className="text-base font-bold tracking-wide text-white uppercase">SOS</span>
    </Link>
  );
}
