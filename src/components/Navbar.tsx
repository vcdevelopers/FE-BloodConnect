import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Search Blood', href: '/search' },
  { label: 'Donate Blood', href: '/donate' },
  { label: 'Blood Camps', href: '/camps' },
  { label: 'Request Blood', href: '/request' },
  { label: 'Organize Camp', href: '/organize' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between lg:h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary lg:h-9 lg:w-9">
            <Droplets className="h-4 w-4 text-primary-foreground lg:h-5 lg:w-5" />
          </div>
          <span className="text-base font-bold tracking-tight lg:text-lg">
            <span className="text-primary">Mumbai Blood</span>Connect
          </span>
          
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                pathname === link.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/login">
            <Button variant="outline" size="sm" className="ml-2">Login</Button>
          </Link>
         <img
    src="/static/Rotary-3141 Logo.png"
    alt="Rotary Logo"
    className="h-10 w-auto object-contain mb-1 pl-2"
  />
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg active:bg-muted lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t bg-background p-3 lg:hidden">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors active:bg-muted ${
                  pathname === link.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="mt-2 w-full h-12">Login</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
