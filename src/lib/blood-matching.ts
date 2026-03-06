import {
  COMPATIBILITY,
  MUMBAI_ZONES,
  type BloodGroup,
  type Donor,
  type BloodRequest,
} from './mock-data';

// Zone adjacency map for proximity scoring
const ZONE_ADJACENCY: Record<string, string[]> = {
  'South Mumbai': ['Dadar / Worli'],
  'Dadar / Worli': ['South Mumbai', 'Bandra / Khar'],
  'Bandra / Khar': ['Dadar / Worli', 'Andheri'],
  'Andheri': ['Bandra / Khar', 'Goregaon / Malad'],
  'Goregaon / Malad': ['Andheri', 'Borivali'],
  'Borivali': ['Goregaon / Malad', 'Thane'],
  'Navi Mumbai': ['Thane', 'Dadar / Worli'],
  'Thane': ['Borivali', 'Navi Mumbai'],
};

interface MatchResult {
  donor: Donor;
  score: number;
  matchType: 'exact' | 'compatible';
  zoneProximity: 'same' | 'nearby' | 'citywide';
}

/**
 * Calculate days since a date string
 */
function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Check if a blood group can donate to the required group
 */
function canDonateTo(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const compatible = COMPATIBILITY[donorGroup];
  return compatible ? compatible.includes(recipientGroup) : false;
}

/**
 * Get zone proximity between two zones
 */
function getZoneProximity(donorZone: string, requestZone: string): 'same' | 'nearby' | 'citywide' {
  if (donorZone === requestZone) return 'same';
  const adjacent = ZONE_ADJACENCY[requestZone] || [];
  if (adjacent.includes(donorZone)) return 'nearby';
  return 'citywide';
}

/**
 * Calculate priority score for a donor match (higher = better)
 */
function calculatePriorityScore(
  donor: Donor,
  request: BloodRequest,
  matchType: 'exact' | 'compatible',
  zoneProximity: 'same' | 'nearby' | 'citywide'
): number {
  let score = 0;

  // Blood match type (exact is much better)
  score += matchType === 'exact' ? 50 : 20;

  // Zone proximity
  score += zoneProximity === 'same' ? 30 : zoneProximity === 'nearby' ? 15 : 0;

  // Days since last donation (more days = more recovered = better)
  const daysSinceLastDonation = daysSince(donor.lastDonation);
  score += Math.min(daysSinceLastDonation / 3, 20); // max 20 points

  // Donation history (experienced donors are more reliable)
  score += Math.min(donor.totalDonations * 2, 15); // max 15 points

  // Urgency boost for emergency
  if (request.urgency === 'Emergency') {
    score += zoneProximity === 'same' ? 20 : zoneProximity === 'nearby' ? 10 : 0;
  }

  return Math.round(score * 10) / 10;
}

/**
 * Check donor eligibility based on gender and last donation
 */
function isDonorEligible(donor: Donor): boolean {
  const gapDays = donor.gender === 'Female' ? 120 : 90;
  return daysSince(donor.lastDonation) >= gapDays;
}

/**
 * Main blood matching algorithm
 * Returns ranked list of matching donors for a blood request
 */
export function findMatchingDonors(
  request: BloodRequest,
  allDonors: Donor[],
  options?: { maxResults?: number; requestZone?: string }
): MatchResult[] {
  const maxResults = options?.maxResults || 20;
  const requestZone = options?.requestZone || 'Andheri'; // default zone

  const results: MatchResult[] = [];

  for (const donor of allDonors) {
    // Skip inactive donors
    if (donor.status !== 'active') continue;

    // Skip ineligible donors
    if (!isDonorEligible(donor)) continue;

    // Step 1: Check exact match
    const isExact = donor.bloodGroup === request.bloodGroup;

    // Step 2: Check compatible match
    const isCompatible = !isExact && canDonateTo(donor.bloodGroup, request.bloodGroup);

    if (!isExact && !isCompatible) continue;

    const matchType = isExact ? 'exact' : 'compatible';

    // Step 3: Get zone proximity
    const zoneProximity = getZoneProximity(donor.zone, requestZone);

    // Step 4: Calculate priority score
    const score = calculatePriorityScore(donor, request, matchType, zoneProximity);

    results.push({ donor, score, matchType, zoneProximity });
  }

  // Sort by score descending (best matches first)
  results.sort((a, b) => b.score - a.score);

  // Cascading zone alert order: same zone first, then nearby, then citywide
  const sameZone = results.filter((r) => r.zoneProximity === 'same');
  const nearbyZone = results.filter((r) => r.zoneProximity === 'nearby');
  const citywide = results.filter((r) => r.zoneProximity === 'citywide');

  return [...sameZone, ...nearbyZone, ...citywide].slice(0, maxResults);
}

/**
 * Check if a blood request qualifies for emergency broadcast
 * (rare blood types or critical urgency)
 */
export function shouldEmergencyBroadcast(request: BloodRequest): boolean {
  const rareTypes: BloodGroup[] = ['O-', 'AB-', 'B-', 'A-'];
  return (
    request.urgency === 'Emergency' &&
    rareTypes.includes(request.bloodGroup)
  );
}

/**
 * Get next eligible donation date for a donor
 */
export function getNextEligibleDate(donor: Donor): Date {
  const gapDays = donor.gender === 'Female' ? 120 : 90;
  const lastDonation = new Date(donor.lastDonation);
  lastDonation.setDate(lastDonation.getDate() + gapDays);
  return lastDonation;
}
