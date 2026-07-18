import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Search Blood', href: '/search' },
  { label: 'Request Blood', href: '/request' },
  { label: 'Blood Camps', href: '/camps' },
  { label: 'Community', href: '/community' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Expanded header desktop height to give the upscaled logo plenty of breathing room */}
      <div className="container flex h-16 items-center justify-between lg:h-24">
        
        {/* Left branding area */}
        <Link to="/" className="flex items-center">
          
          <img
              src={`${import.meta.env.BASE_URL}Regal Logo.png`}
              alt="Regal Logo"
              className="h-10 w-auto object-contain lg:h-[4.5rem]" 
            />
            <img
              src={`${import.meta.env.BASE_URL}Create Lasting Impact.png`}
              alt="Create Lasting Impact Logo"
              className="h-10 w-auto object-contain lg:h-[4.5rem]"
            />
            {/* Force-scaling the Rotary logo by 150% using Tailwind's transform tools.
              If it is STILL too small, change "lg:scale-150" below to "lg:scale-[1.75]" or "lg:scale-[2]"
            */}
            <img
              src={`${import.meta.env.BASE_URL}Rotary.png`}
              alt="Rotary Logo"
              className="h-12 w-auto object-contain transform origin-center scale-110 lg:h-[4.5rem] lg:scale-150 lg:mx-4"
            />
          
          {/* Vertical line and all three logos */}
          {/* <div className="flex items-center 6 border-l-2 pl-4 dark:border-muted">
            <span className="text-base font-bold tracking-tight lg:text-2xl whitespace-nowrap">
            <span className="text-primary">Mumbai Blood</span> Tracker
          </span>
          </div> */}
        </Link>

        {/* Desktop nav — Clean right side */}
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
            {/* <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="mt-2 w-full h-12">Login</Button>
            </Link> */}
          </div>
        </nav>
      )}
    </header>
  );
}