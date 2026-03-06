import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { EmergencyButton } from './EmergencyButton';
import { MobileBottomNav } from './MobileBottomNav';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
      <EmergencyButton />
      <MobileBottomNav />
    </div>
  );
}
