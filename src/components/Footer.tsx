import { Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        {/* Adjusted from lg:grid-cols-4 to lg:grid-cols-3 for balanced spatial distribution */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          
          {/* Section 1: Brand & Logos */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4 flex-wrap">
              <img
                src={`${import.meta.env.BASE_URL}Regal Logo.png`}
                alt="Regal Logo"
                className="h-10 w-auto object-contain lg:h-[3.5rem]" 
              />
              <img
                src={`${import.meta.env.BASE_URL}Create Lasting Impact.png`}
                alt="Create Lasting Impact Logo"
                className="h-10 w-auto object-contain lg:h-[4.5rem]" 
              />
              <img
                src={`${import.meta.env.BASE_URL}Rotary.png`}
                alt="Rotary Logo"
                className="h-10 w-auto object-contain lg:h-[5rem]" 
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Connecting blood donors with those in need across Mumbai. Every drop counts.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground tracking-wide">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link to="/search" className="hover:text-primary transition-colors w-fit">
                Search Blood
              </Link>
              <Link to="/request" className="hover:text-primary transition-colors w-fit">
                Request Blood
              </Link>
            </div>
          </div>

          {/* Section 3: Emergency Contacts */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground tracking-wide">Emergency Contacts</h4>
            <div className="flex flex-col gap-3.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>(022) - 26772036 / 66952036</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>(022) - 66922036 / 42642036</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="break-all">mumbaibloodtracker@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Unchanged Bottom Copyright section */}
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © 2026 Mumbai Blood Connect. All rights reserved. Made with ❤️ for Mumbai.
        </div>
      </div>
    </footer>
  );
}