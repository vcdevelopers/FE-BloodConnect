import { Droplets, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div>
  {/* Rotary Logo */}
  <img
    src={`${import.meta.env.BASE_URL}rotary1.jpg`}
    alt="Rotary Logo"
    className="h-12 w-auto object-contain mb-1 pl-10"
  /></div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Droplets className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Mumbai Blood Tracker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting blood donors with those in need across Mumbai. Every drop counts.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/search" className="hover:text-primary transition-colors">Search Blood</Link>
              <Link to="/donate" className="hover:text-primary transition-colors">Become a Donor</Link>
              <Link to="/camps" className="hover:text-primary transition-colors">Blood Camps</Link>
              <Link to="/request" className="hover:text-primary transition-colors">Request Blood</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Emergency Contacts</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(022) - 26772036 / 66952036</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                {/* <span>Emergency: 108</span> */}
                <span>(022) - 66922036 / 42642036</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>arun.wadhwa@envisageideas.com</span>
                
              </div>
              {/* <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;info@digielvestech.in</span> */}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">NGO Partners</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Indian Red Cross Society</span>
              <span>Rotary Blood Bank</span>
              <span>Friends2Support</span>
              <span>BloodConnect Foundation</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © 2026 Mumbai Blood Connect. All rights reserved. Made with ❤️ for Mumbai.
        </div>
      </div>
    </footer>
  );
}
