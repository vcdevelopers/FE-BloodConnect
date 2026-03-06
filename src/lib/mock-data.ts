export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

export const MUMBAI_ZONES = [
  'South Mumbai', 'Dadar / Worli', 'Bandra / Khar', 'Andheri',
  'Goregaon / Malad', 'Borivali', 'Navi Mumbai', 'Thane'
] as const;

export const URGENCY_LEVELS = ['Normal', 'Urgent', 'Emergency'] as const;

export const COMPATIBILITY: Record<string, string[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export interface BloodBank {
  id: string;
  name: string;
  location: string;
  zone: string;
  contact: string;
  inventory: { group: BloodGroup; units: number }[];
  distance?: string;
}

export interface Campaign {
  id: string;
  name: string;
  organizer: string;
  location: string;
  zone: string;
  date: string;
  time: string;
  slots: number;
  slotsBooked: number;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'pending';
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  zone: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  lastDonation: string;
  totalDonations: number;
  eligible: boolean;
  nextEligible: string;
  status: 'active' | 'inactive';
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  hospitalAddress: string;
  attendantName: string;
  phone: string;
  urgency: 'Normal' | 'Urgent' | 'Emergency';
  status: 'pending' | 'approved' | 'matched' | 'completed' | 'cancelled';
  date: string;
  matchedDonors: number;
}

export interface Alert {
  id: string;
  type: 'sms' | 'whatsapp' | 'email' | 'push';
  message: string;
  recipients: number;
  bloodGroup?: BloodGroup;
  zone?: string;
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
}

export const mockBloodBanks: BloodBank[] = [
  { id: '1', name: 'Lilavati Hospital Blood Bank', location: 'Bandra West', zone: 'Bandra / Khar', contact: '+91 22 2640 0000', inventory: [{ group: 'A+', units: 12 }, { group: 'O+', units: 8 }, { group: 'B+', units: 5 }, { group: 'AB+', units: 3 }, { group: 'O-', units: 2 }], distance: '2.3 km' },
  { id: '2', name: 'Kokilaben Hospital Blood Bank', location: 'Andheri West', zone: 'Andheri', contact: '+91 22 3066 6666', inventory: [{ group: 'A+', units: 15 }, { group: 'O+', units: 20 }, { group: 'B+', units: 10 }, { group: 'AB-', units: 1 }, { group: 'A-', units: 4 }], distance: '5.1 km' },
  { id: '3', name: 'Hinduja Hospital Blood Bank', location: 'Mahim', zone: 'Dadar / Worli', contact: '+91 22 2445 2222', inventory: [{ group: 'O+', units: 18 }, { group: 'B+', units: 7 }, { group: 'A+', units: 9 }, { group: 'O-', units: 5 }], distance: '3.8 km' },
  { id: '4', name: 'Jaslok Hospital Blood Bank', location: 'Pedder Road', zone: 'South Mumbai', contact: '+91 22 6657 3333', inventory: [{ group: 'AB+', units: 6 }, { group: 'A-', units: 3 }, { group: 'B-', units: 2 }, { group: 'O+', units: 14 }], distance: '8.2 km' },
  { id: '5', name: 'Fortis Hospital Blood Bank', location: 'Mulund', zone: 'Thane', contact: '+91 22 6799 4444', inventory: [{ group: 'A+', units: 11 }, { group: 'B+', units: 13 }, { group: 'O-', units: 3 }, { group: 'AB+', units: 4 }], distance: '12.5 km' },
];

export const mockCampaigns: Campaign[] = [
  { id: '1', name: 'World Blood Donor Day Drive', organizer: 'Red Cross Mumbai', location: 'Dadar TT Circle, Mumbai', zone: 'Dadar / Worli', date: '2026-03-15', time: '9:00 AM - 5:00 PM', slots: 100, slotsBooked: 67, description: 'Join us for the annual World Blood Donor Day mega drive.', status: 'upcoming' },
  { id: '2', name: 'Corporate Blood Drive', organizer: 'TCS Foundation', location: 'BKC, Bandra East', zone: 'Bandra / Khar', date: '2026-03-20', time: '10:00 AM - 4:00 PM', slots: 50, slotsBooked: 23, description: 'A corporate blood donation initiative for TCS employees and public.', status: 'upcoming' },
  { id: '3', name: 'College Blood Donation Camp', organizer: 'NSS Mumbai University', location: 'Kalina Campus, Santacruz', zone: 'Andheri', date: '2026-03-25', time: '8:00 AM - 2:00 PM', slots: 200, slotsBooked: 145, description: 'Annual student blood donation camp organized by NSS.', status: 'upcoming' },
  { id: '4', name: 'Emergency O- Drive', organizer: 'Mumbai Blood Connect', location: 'Andheri Sports Complex', zone: 'Andheri', date: '2026-04-01', time: '9:00 AM - 6:00 PM', slots: 75, slotsBooked: 12, description: 'Urgent need for O- blood type donors. Walk-ins welcome.', status: 'upcoming' },
];

export const mockDonors: Donor[] = [
  { id: '1', name: 'Rajesh Kumar', bloodGroup: 'O+', zone: 'Andheri', phone: '+91 98765 43210', email: 'rajesh@email.com', gender: 'Male', age: 32, lastDonation: '2025-12-15', totalDonations: 8, eligible: true, nextEligible: '2026-03-15', status: 'active' },
  { id: '2', name: 'Priya Sharma', bloodGroup: 'A+', zone: 'Bandra / Khar', phone: '+91 98765 43211', email: 'priya@email.com', gender: 'Female', age: 28, lastDonation: '2025-11-20', totalDonations: 5, eligible: true, nextEligible: '2026-03-20', status: 'active' },
  { id: '3', name: 'Amit Patel', bloodGroup: 'B+', zone: 'Dadar / Worli', phone: '+91 98765 43212', email: 'amit@email.com', gender: 'Male', age: 35, lastDonation: '2026-01-10', totalDonations: 12, eligible: false, nextEligible: '2026-04-10', status: 'active' },
  { id: '4', name: 'Sneha Desai', bloodGroup: 'AB+', zone: 'South Mumbai', phone: '+91 98765 43213', email: 'sneha@email.com', gender: 'Female', age: 30, lastDonation: '2025-10-05', totalDonations: 3, eligible: true, nextEligible: '2026-02-02', status: 'active' },
  { id: '5', name: 'Vikram Singh', bloodGroup: 'O-', zone: 'Thane', phone: '+91 98765 43214', email: 'vikram@email.com', gender: 'Male', age: 40, lastDonation: '2026-02-01', totalDonations: 20, eligible: false, nextEligible: '2026-05-01', status: 'active' },
  { id: '6', name: 'Meera Joshi', bloodGroup: 'A-', zone: 'Goregaon / Malad', phone: '+91 98765 43215', email: 'meera@email.com', gender: 'Female', age: 26, lastDonation: '2025-09-15', totalDonations: 2, eligible: true, nextEligible: '2026-01-13', status: 'active' },
];

export const mockBloodRequests: BloodRequest[] = [
  { id: '1', patientName: 'Suresh Mehta', bloodGroup: 'O+', units: 3, hospital: 'Lilavati Hospital', hospitalAddress: 'Bandra West', attendantName: 'Ramesh Mehta', phone: '+91 98765 11111', urgency: 'Emergency', status: 'approved', date: '2026-03-06', matchedDonors: 5 },
  { id: '2', patientName: 'Anita Verma', bloodGroup: 'AB-', units: 2, hospital: 'Kokilaben Hospital', hospitalAddress: 'Andheri West', attendantName: 'Rahul Verma', phone: '+91 98765 22222', urgency: 'Urgent', status: 'pending', date: '2026-03-06', matchedDonors: 0 },
  { id: '3', patientName: 'Manoj Tiwari', bloodGroup: 'B+', units: 1, hospital: 'Hinduja Hospital', hospitalAddress: 'Mahim', attendantName: 'Sunita Tiwari', phone: '+91 98765 33333', urgency: 'Normal', status: 'completed', date: '2026-03-05', matchedDonors: 3 },
  { id: '4', patientName: 'Kavita Nair', bloodGroup: 'A+', units: 2, hospital: 'Jaslok Hospital', hospitalAddress: 'Pedder Road', attendantName: 'Vinod Nair', phone: '+91 98765 44444', urgency: 'Emergency', status: 'matched', date: '2026-03-06', matchedDonors: 4 },
];

export const mockAlerts: Alert[] = [
  { id: '1', type: 'sms', message: 'Urgent: O+ blood needed at Lilavati Hospital, Bandra.', recipients: 45, bloodGroup: 'O+', zone: 'Bandra / Khar', sentAt: '2026-03-06 10:30 AM', status: 'sent' },
  { id: '2', type: 'whatsapp', message: 'Emergency: AB- blood required within 3 hours at Kokilaben Hospital.', recipients: 12, bloodGroup: 'AB-', sentAt: '2026-03-06 09:15 AM', status: 'sent' },
  { id: '3', type: 'email', message: 'Blood donation camp at Dadar TT Circle on March 15. Register now!', recipients: 230, sentAt: '2026-03-05 02:00 PM', status: 'sent' },
];

export const mockStats = {
  totalDonors: 2847,
  activeRequests: 14,
  unitsAvailable: 342,
  activeCampaigns: 8,
  requestsToday: 6,
};
