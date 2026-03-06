

# MUMBAI BLOOD CONNECT — Implementation Plan

## Design System
- **Colors**: Red (#DC2626) primary, white background, dark red (#991B1B) accent, grey (#4B5563) text
- **Mobile-first** responsive design with healthcare/emergency feel
- Large touch-friendly buttons, clean medical UI
- Floating emergency blood request button on all pages

## Phase 1: Database & Auth Setup (Supabase)

**Tables**: users, donors, blood_requests, blood_banks, blood_inventory, campaigns, campaign_registrations, donor_responses, alerts, zones

**Auth**: Supabase Auth with email/password for all user types. Role-based access (admin, hospital, donor, public) stored in a separate user_roles table with RLS policies.

**Key relationships**: Donors linked to zones, blood inventory linked to blood banks, donor responses linked to blood requests and alerts.

## Phase 2: Public Website Pages

### Navigation
- Responsive navbar: Home, Search Blood, Donate Blood, Blood Camps, Request Blood, Organize Camp, Login
- Floating red emergency button visible on all pages

### Home Page
- Hero with "Find Blood. Save Lives. Support Mumbai." headline and 3 CTA buttons
- Emergency blood search quick-access section
- Upcoming blood donation camps carousel
- "How It Works" 3-step section
- Live statistics from database (donors, requests, units, campaigns)
- "Become a Lifesaver Today" CTA
- Footer with emergency contacts, about, partners

### Blood Availability Search
- Filters: blood group, Mumbai area/pincode, hospital, units, urgency
- Results cards showing blood bank name, group, units, distance, contact, request button
- Map visualization placeholder (Google Maps integration later)

### Donor Registration
- Multi-field form with health declaration
- Automatic eligibility calculation (90 days men, 120 days women)
- Confirmation message on submission

### Emergency Blood Request Form
- Patient details, blood group, units, hospital, urgency, date
- Triggers admin notification + donor matching on submission

### Blood Donation Campaigns
- Campaign listing with filters (area, date, organizer)
- Campaign detail page with register-to-donate button

### Organize Blood Camp Form
- Organization details form, submitted for admin approval

## Phase 3: Admin Dashboard

### Layout
- Sidebar navigation: Dashboard, Blood Requests, Donors, Blood Banks, Campaigns, Alerts, Reports, Settings
- Desktop full-grid, tablet 2-col, mobile single-col

### Dashboard Overview
- Stats cards (total donors, active requests, available units, active campaigns)
- Charts: requests by blood group, monthly donations (using Recharts)
- Recent activity feed

### Management Pages
- **Blood Requests**: Table with approve, trigger matching, mark completed actions
- **Donors**: List with profile view, edit, deactivate, eligibility status
- **Blood Banks**: Hospital listing with inventory view
- **Campaigns**: Approve, edit, delete campaigns
- **Alerts**: Send alerts by area, blood group, or to all donors

### Reports
- Blood requests/month, donor activity, campaign stats, inventory reports
- Export to CSV

## Phase 4: Blood Matching & Alert Engine

### Blood Matching Algorithm (Edge Function)
- Step 1: Find exact blood group donors
- Step 2: Find compatible donors using compatibility matrix
- Step 3: Filter by location (zone proximity), eligibility, active status
- Step 4: Rank by priority score

### Smart Donor Priority Engine
- Score donors by: zone proximity, blood compatibility, days since last donation, donation history, past response rate
- Alert top-ranked donors first

### Mumbai Zone-Based Network
- 8 zones (South Mumbai, Dadar/Worli, Bandra/Khar, Andheri, Goregaon/Malad, Borivali, Navi Mumbai, Thane)
- Cascading alerts: same zone → nearby zones → citywide

### Eligibility Tracker
- Auto-calculate next eligible date per donor
- Block ineligible donors from receiving alerts

### Emergency Broadcast
- Admin-triggered broadcast for rare blood types to all matching donors, hospitals, NGOs, blood banks

## Phase 5: Hospital / Blood Bank Panel
- Hospital login with inventory management
- Update blood units by group
- Inventory feeds into public search results

## Integrations (Require API Keys)
- **SMS/WhatsApp**: Alert channels via edge functions (API keys needed later)
- **Google Maps**: Blood bank map visualization (API key needed later)
- For MVP, alerts will be stored in-database with in-app notifications; SMS/WhatsApp/email added when API keys are configured

## Summary
A phased build starting with database/auth, then public pages, admin dashboard, and finally the matching/alert engine. All built with React + Tailwind + Supabase, mobile-first responsive design with a red healthcare theme.

