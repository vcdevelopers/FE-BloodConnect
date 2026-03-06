import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Calendar, User, Droplets } from 'lucide-react';

const tabs = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Request', href: '/request', icon: Heart },
  { label: 'Camps', href: '/camps', icon: Calendar },
  { label: 'Account', href: '/login', icon: User },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden safe-area-bottom">
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
