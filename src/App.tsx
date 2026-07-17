import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { AdminLayout } from "@/components/AdminLayout";
import Index from "./pages/Index";
import SearchBlood from "./pages/SearchBlood";
import DonateBlood from "./pages/DonateBlood";
import RequestBlood from "./pages/RequestBlood";
import BloodCamps from "./pages/BloodCamps";
import OrganizeCamp from "./pages/OrganizeCamp";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRequests from "./pages/admin/Requests";
import AdminDonors from "./pages/admin/Donors";
import AdminBloodBanks from "./pages/admin/BloodBanks";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminAlerts from "./pages/admin/Alerts";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminMatchingEngine from "./pages/admin/MatchingEngine";
import InstallApp from "./pages/InstallApp";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchBlood />} />
            <Route path="/donate" element={<DonateBlood />} />
            <Route path="/request" element={<RequestBlood />} />
            <Route path="/camps" element={<BloodCamps />} />
            <Route path="/organize" element={<OrganizeCamp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/install" element={<InstallApp />} />
            <Route path="/community" element={<Community />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="donors" element={<AdminDonors />} />
            <Route path="blood-banks" element={<AdminBloodBanks />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="alerts" element={<AdminAlerts />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="matching" element={<AdminMatchingEngine />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
