export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  subLocation: string;
  developer: string;
  category: 'Apartments' | 'Villas & Townhouses' | 'Off-plan' | 'Penthouses';
  status: 'Ready' | 'Off-Plan' | 'Handover 2026' | 'Handover 2027';
  pricingNote: string;
  startingPriceAED: number;
  bedrooms: string;
  bathrooms: string;
  areaRangeSqFt: string;
  primaryImage: string;
  gallery: string[];
  description: string;
  keyFeatures: string[];
  handoverDate?: string;
  paymentPlan?: string;
  isFeatured?: boolean;
  isSignatureSpotlight?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  languages: string[];
  bio: string;
  image: string;
}

export interface CommunityItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  queryParam: string;
}

export const GNS_CONFIG = {
  companyName: "GNS Real Estate",
  tagline: "Prime Dubai Residential & Investment Brokerage",
  eyebrow: "GNS REAL ESTATE · DUBAI",
  heroHeading: "Find Your Home.\nBuild Your Future.",
  heroSubheading: "Explore Dubai homes and investment opportunities with GNS Real Estate.",
  phone: "+971 4 582 9900",
  whatsapp: "+971501234567",
  whatsappFormatted: "+971 50 123 4567",
  email: "advisory@gnsrealestate.ae",
  officeAddress: "Suite 2401, Vision Tower, Business Bay, Dubai, UAE",
  reraOrLicense: "RERA Broker License No. 28941 · ORN 19482",
};

export const VERIFIED_COMMUNITIES: CommunityItem[] = [
  {
    id: 'creek-harbour',
    name: 'Dubai Creek Harbour',
    tagline: 'Waterfront promenade & iconic skyline vistas',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    queryParam: 'Creek Harbour',
  },
  {
    id: 'business-bay',
    name: 'Business Bay',
    tagline: 'Urban architectural high-rises by the Dubai Canal',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=85',
    queryParam: 'Business Bay',
  },
  {
    id: 'dubai-hills',
    name: 'Dubai Hills Estate',
    tagline: 'Championship golf fairways & family estate villas',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
    queryParam: 'Dubai Hills',
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    tagline: 'World-renowned coastal archipelago & penthouses',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    queryParam: 'Palm Jumeirah',
  },
  {
    id: 'maritime-city',
    name: 'Dubai Maritime City',
    tagline: 'Arabian Gulf oceanfront with private marina berths',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
    queryParam: 'Maritime City',
  },
  {
    id: 'dubai-islands',
    name: 'Dubai Islands',
    tagline: 'Pristine island resort living & emerging masterplans',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85',
    queryParam: 'Dubai Islands',
  },
];

export const VERIFIED_TEAM: TeamMember[] = [
  {
    id: 'tariq-al-ghaith',
    name: 'Tariq Al-Ghaith',
    role: 'Managing Director & Founder',
    department: 'Executive Leadership',
    languages: ['English', 'Arabic'],
    bio: 'Over 18 years steering prime advisory across Dubai’s ultra-luxury sectors.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'nadia-mansoor',
    name: 'Nadia Mansoor',
    role: 'Head of Prime & Luxury Sales',
    department: 'Private Brokerage',
    languages: ['English', 'Arabic', 'French'],
    bio: 'Specialising in trophy villas on Palm Jumeirah and Emirates Hills.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rashid-al-nuaimi',
    name: 'Rashid Al-Nuaimi',
    role: 'Director of Off-Plan Investments',
    department: 'Off-Plan & Developments',
    languages: ['English', 'Arabic'],
    bio: 'Deep technical insight into master developer pipelines and payment milestone structuring.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sophia-laurent',
    name: 'Sophia Laurent',
    role: 'Senior Private Client Advisor',
    department: 'European & UK Desk',
    languages: ['English', 'French', 'German'],
    bio: 'Advises European investors relocating to the UAE, focusing on Downtown penthouses.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  },
];

export const VERIFIED_PROPERTIES: PropertyItem[] = [
  {
    id: 'oria-creek-harbour',
    slug: 'oria-by-emaar',
    title: 'Oria by Emaar',
    location: 'Dubai Creek Harbour',
    subLocation: 'Creek Beach Island',
    developer: 'Emaar Properties',
    category: 'Off-plan',
    status: 'Off-Plan',
    pricingNote: 'Starting from AED 1,750,000',
    startingPriceAED: 1750000,
    bedrooms: '1 to 3 Bedrooms',
    bathrooms: '2 to 4 Bathrooms',
    areaRangeSqFt: '749 – 1,820 sq ft',
    primaryImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'An architectural waterfront statement at Dubai Creek Harbour by master developer Emaar.',
    keyFeatures: [
      'Direct Creek Beach & Promenade Access',
      'Panoramic Views of Downtown Dubai Skyline',
      'Infinity Pool & Landscaped Sun Deck',
    ],
    handoverDate: 'Q3 2027',
    paymentPlan: '80% During Construction / 20% on Handover',
    isFeatured: true,
  },
  {
    id: 'bayz-102-business-bay',
    slug: 'bayz-102-business-bay',
    title: 'Bayz 102 by Danube',
    location: 'Business Bay',
    subLocation: 'Burj Khalifa Corridor',
    developer: 'Danube Properties',
    category: 'Apartments',
    status: 'Handover 2027',
    pricingNote: 'Starting from AED 1,320,000',
    startingPriceAED: 1320000,
    bedrooms: 'Studio, 1 to 3 Bedrooms',
    bathrooms: '1 to 3 Bathrooms',
    areaRangeSqFt: '480 – 1,450 sq ft',
    primaryImage: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'A striking 102-storey tower rising above the Business Bay canal.',
    keyFeatures: [
      'Unobstructed Burj Khalifa & Canal Vistas',
      'Private Plunge Pools in Selected Units',
      '1% Monthly Post-Handover Payment Structure',
    ],
    handoverDate: 'Q4 2027',
    paymentPlan: '70% During Construction / 30% Post-Handover',
    isFeatured: true,
  },
  {
    id: 'silva-dubai-hills',
    slug: 'silva-residences-dubai-hills',
    title: 'Silva Residences',
    location: 'Dubai Hills Estate',
    subLocation: 'Championship Golf Course',
    developer: 'Emaar Properties',
    category: 'Villas & Townhouses',
    status: 'Ready',
    pricingNote: 'Starting from AED 4,800,000',
    startingPriceAED: 4800000,
    bedrooms: '3 to 5 Bedrooms',
    bathrooms: '4 to 6 Bathrooms',
    areaRangeSqFt: '2,950 – 5,400 sq ft',
    primaryImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Nestled beside the green fairways of Dubai Hills Golf Club, Silva Residences provide sprawling family homes.',
    keyFeatures: [
      'Front-Line Golf Course Orientation',
      'Expansive Private Terraces & Gardens',
      'Gated Community with 24/7 Security Patrol',
    ],
    handoverDate: 'Ready for Immediate Occupancy',
    paymentPlan: 'Cash or Mortgage with GNS Advisory Assistance',
    isFeatured: true,
  },
  {
    id: 'breez-maritime-city',
    slug: 'breez-by-danube',
    title: 'Breez by Danube',
    location: 'Dubai Maritime City',
    subLocation: 'Arabian Gulf Shoreline',
    developer: 'Danube Properties',
    category: 'Apartments',
    status: 'Off-Plan',
    pricingNote: 'Starting from AED 1,650,000',
    startingPriceAED: 1650000,
    bedrooms: '1 to 3 Bedrooms & Duplexes',
    bathrooms: '2 to 4 Bathrooms',
    areaRangeSqFt: '710 – 2,100 sq ft',
    primaryImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Breez commands a prime position within Dubai Maritime City with direct maritime views.',
    keyFeatures: [
      'Direct Arabian Gulf Open Sea Views',
      'Over 40 Resort-Style Amenities',
      'Infinity Pool Overlooking Port Rashid Yacht Marina',
    ],
    handoverDate: 'Q1 2028',
    paymentPlan: '65% During Construction / 35% on Handover',
    isFeatured: false,
  },
  {
    id: 'samana-ocean-crest',
    slug: 'samana-ocean-crest',
    title: 'Samana Ocean Crest',
    location: 'Dubai Islands',
    subLocation: 'Island A Shoreline',
    developer: 'Samana Developers',
    category: 'Off-plan',
    status: 'Off-Plan',
    pricingNote: 'Starting from AED 1,480,000',
    startingPriceAED: 1480000,
    bedrooms: '1 to 3 Bedrooms with Private Pool',
    bathrooms: '2 to 4 Bathrooms',
    areaRangeSqFt: '690 – 1,600 sq ft',
    primaryImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'A boutique coastal enclave featuring private plunge pools integrated into every residence terrace.',
    keyFeatures: [
      'Private Terrace Plunge Pool in Every Apartment',
      'Direct Private Beach Access',
      'Wellness Spa & Hydrotherapy Suite',
    ],
    handoverDate: 'Q4 2026',
    paymentPlan: 'Flexible Monthly Milestone Structure',
    isFeatured: false,
  },
  {
    id: 'shams-waterfront-townhouses',
    slug: 'shams-townhouses',
    title: 'Shams Waterfront Residences',
    location: 'Dubai Harbour',
    subLocation: 'Marina Promenade',
    developer: 'Meraas',
    category: 'Villas & Townhouses',
    status: 'Handover 2026',
    pricingNote: 'Starting from AED 6,200,000',
    startingPriceAED: 6200000,
    bedrooms: '3 & 4 Bedrooms',
    bathrooms: '4 & 5 Bathrooms',
    areaRangeSqFt: '3,200 – 4,800 sq ft',
    primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Refined contemporary townhouses perched along the Dubai Harbour waterway.',
    keyFeatures: [
      'Private Berth Allocation Options',
      'Rooftop Entertainment Sky-Terrace',
      'Floor-to-Ceiling Acoustic Glazing',
    ],
    handoverDate: 'Q2 2026',
    paymentPlan: '60% Construction / 40% Completion',
    isFeatured: false,
  },
  {
    id: 'signature-palm-penthouse',
    slug: 'the-luminary-penthouse-palm',
    title: 'The Luminary Penthouse',
    location: 'Palm Jumeirah',
    subLocation: 'Crescent West',
    developer: 'Omniyat',
    category: 'Penthouses',
    status: 'Ready',
    pricingNote: 'Price Upon Private Inquiry',
    startingPriceAED: 42000000,
    bedrooms: '5 Bedrooms + Staff Quarters',
    bathrooms: '7 Bathrooms',
    areaRangeSqFt: '11,200 sq ft',
    primaryImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85',
    ],
    description: 'An extraordinary full-floor trophy residence offering 360-degree vistas across the open Gulf and Dubai skyline.',
    keyFeatures: [
      '360-Degree Panoramic Ocean & Skyline Views',
      'Private 25-Metre Cantilevered Infinity Pool',
      'Managed Exclusively by Dorchester Collection',
    ],
    handoverDate: 'Immediate Private Handover',
    paymentPlan: 'Private Office Structured Settlement',
    isFeatured: true,
  },
];

export function propertyMatchesBedrooms(
  propBedroomsStr: string,
  queryBedrooms?: string | number
): boolean {
  if (!queryBedrooms) return true;
  const qStr = String(queryBedrooms).toLowerCase().trim();
  const propLower = propBedroomsStr.toLowerCase();

  if (qStr.includes('studio')) {
    return propLower.includes('studio');
  }

  const numMatch = qStr.match(/\d+/);
  if (!numMatch) {
    return propLower.includes(qStr);
  }
  const targetNum = parseInt(numMatch[0], 10);

  const rangeMatch = propLower.match(/(\d+)\s*to\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    if (targetNum >= min && targetNum <= max) return true;
  }

  const andMatch = propLower.match(/(\d+)\s*&\s*(\d+)/);
  if (andMatch) {
    const n1 = parseInt(andMatch[1], 10);
    const n2 = parseInt(andMatch[2], 10);
    if (targetNum === n1 || targetNum === n2) return true;
  }

  const singleMatch = propLower.match(/(\d+)\s*bedroom/);
  if (singleMatch && parseInt(singleMatch[1], 10) === targetNum) {
    return true;
  }

  return propLower.includes(String(targetNum));
}

export function findClosestProperties(criteria: {
  location?: string;
  bedrooms?: string;
  max_budget?: number;
  type?: string;
}): PropertyItem[] {
  const scored = VERIFIED_PROPERTIES.map((p) => {
    let score = 0;
    if (criteria.location) {
      const locQ = criteria.location.toLowerCase();
      if (
        p.location.toLowerCase().includes(locQ) ||
        p.subLocation.toLowerCase().includes(locQ)
      ) {
        score += 3;
      }
    }
    if (criteria.type) {
      if (p.category.toLowerCase().includes(criteria.type.toLowerCase())) {
        score += 2;
      }
    }
    if (criteria.bedrooms && propertyMatchesBedrooms(p.bedrooms, criteria.bedrooms)) {
      score += 2;
    }
    if (criteria.max_budget) {
      const diff = Math.abs(p.startingPriceAED - criteria.max_budget);
      score += Math.max(0, 3 - diff / 2000000);
    }
    return { property: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map((s) => s.property);
}
