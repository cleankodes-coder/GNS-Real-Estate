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

export interface DeveloperPartner {
  id: string;
  name: string;
  tagline: string;
  logoText: string;
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
  heroPosterImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=85",
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

export const VERIFIED_DEVELOPERS: DeveloperPartner[] = [
  { id: 'emaar', name: 'Emaar Properties', tagline: 'Master developer of Downtown & Creek Harbour', logoText: 'EMAAR' },
  { id: 'damac', name: 'DAMAC Properties', tagline: 'Luxury branded residences & golf estates', logoText: 'DAMAC' },
  { id: 'nakheel', name: 'Nakheel', tagline: 'Creator of Palm Jumeirah & Dubai Islands', logoText: 'NAKHEEL' },
  { id: 'meraas', name: 'Meraas', tagline: 'Urban lifestyle destinations & beachfront living', logoText: 'MERAAS' },
  { id: 'sobha', name: 'Sobha Realty', tagline: 'Pioneers of backwards-integrated luxury craft', logoText: 'SOBHA' },
  { id: 'omniyat', name: 'Omniyat', tagline: 'Bespoke architectural collector assets', logoText: 'OMNIYAT' },
  { id: 'select', name: 'Select Group', tagline: 'Waterfront landmarks across Dubai Marina', logoText: 'SELECT GROUP' },
  { id: 'ellington', name: 'Ellington Properties', tagline: 'Design-led boutique residences', logoText: 'ELLINGTON' },
];

export const VERIFIED_TEAM: TeamMember[] = [
  {
    id: 'tariq-al-ghaith',
    name: 'Tariq Al-Ghaith',
    role: 'Managing Director & Founder',
    department: 'Executive Leadership',
    languages: ['English', 'Arabic'],
    bio: 'Over 18 years steering prime advisory across Dubai’s ultra-luxury sectors, guiding high-net-worth families and private offices with quiet discretion.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'nadia-mansoor',
    name: 'Nadia Mansoor',
    role: 'Head of Prime & Luxury Sales',
    department: 'Private Brokerage',
    languages: ['English', 'Arabic', 'French'],
    bio: 'Specialising in trophy villas on Palm Jumeirah and Emirates Hills, Nadia orchestrates confidential transactions for distinguished international clients.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rashid-al-nuaimi',
    name: 'Rashid Al-Nuaimi',
    role: 'Director of Off-Plan Investments',
    department: 'Off-Plan & Developments',
    languages: ['English', 'Arabic'],
    bio: 'Deep technical insight into master developer pipelines, payment milestone structuring, and early-allocation launch access across Dubai.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sophia-laurent',
    name: 'Sophia Laurent',
    role: 'Senior Private Client Advisor',
    department: 'European & UK Desk',
    languages: ['English', 'French', 'German'],
    bio: 'Advises European investors relocating to the UAE, focusing on Downtown penthouses and beachfront sanctuaries with bespoke lifestyle guidance.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'karim-el-khatib',
    name: 'Karim El-Khatib',
    role: 'Commercial & Mixed-Use Acquisitions Lead',
    department: 'Institutional Advisory',
    languages: ['English', 'Arabic'],
    bio: 'Manages prime commercial floor plates, hospitality acquisitions, and mixed-use development portfolios across DIFC and Business Bay.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    role: 'Head of Client Experience & Advisory',
    department: 'Concierge & Private Office',
    languages: ['English', 'Russian', 'Italian'],
    bio: 'Ensures seamless end-to-end representation from initial portfolio curation through conveyancing, private viewing itineraries, and handover.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'omar-bin-zayed',
    name: 'Omar Bin Zayed',
    role: 'Senior Advisor, Waterfront Specialist',
    department: 'Prime Residential',
    languages: ['English', 'Arabic'],
    bio: 'Focuses exclusively on prime coastal enclaves, superyacht berths, and private beachfront estates across Dubai Islands and Dubai Harbour.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    role: 'Development & Market Intelligence Analyst',
    department: 'Research & Advisory',
    languages: ['English', 'Mandarin'],
    bio: 'Delivers sovereign and private clients rigorous data modeling on capital appreciation trajectories, rental yields, and secondary market liquidity.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
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
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'An architectural waterfront statement at Dubai Creek Harbour, Oria blends serene canal vistas with direct promenade access, refined interior finishes, and world-class leisure amenities by master developer Emaar.',
    keyFeatures: [
      'Direct Creek Beach & Promenade Access',
      'Panoramic Views of Downtown Dubai Skyline',
      'Infinity Pool & Landscaped Sun Deck',
      'State-of-the-Art Health Club & Yoga Studio',
      'Children’s Play Hub & Dedicated Splash Park',
      'Flexible 80/20 Post-Handover Payment Milestone',
    ],
    handoverDate: 'Q3 2027',
    paymentPlan: '80% During Construction / 20% on Handover',
    isFeatured: true,
    isSignatureSpotlight: false,
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
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'A striking 102-storey tower rising above the Business Bay canal, delivering fully furnished residences designed for urban sophistication and exceptional short-term and long-term rental performance.',
    keyFeatures: [
      'Unobstructed Burj Khalifa & Canal Vistas',
      'Private Plunge Pools in Selected Units',
      'Sky Lounge & Rooftop Observatory',
      'Helipad Access & Executive Business Centre',
      '1% Monthly Post-Handover Payment Structure',
    ],
    handoverDate: 'Q4 2027',
    paymentPlan: '70% During Construction / 30% Over 30 Months Post-Handover',
    isFeatured: true,
    isSignatureSpotlight: false,
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
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Nestled beside the green fairways of Dubai Hills Golf Club, Silva Residences provide sprawling family homes characterised by double-height living spaces, floor-to-ceiling glass, and tranquil landscaped gardens.',
    keyFeatures: [
      'Front-Line Golf Course Orientation',
      'Expansive Private Terraces & Gardens',
      'Gated Community with 24/7 Security Patrol',
      'Proximity to Dubai Hills Mall & King’s College Hospital',
      'Private Double Garage with EV Fast Charger',
    ],
    handoverDate: 'Ready for Immediate Occupancy',
    paymentPlan: 'Cash or Mortgage with GNS Advisory Assistance',
    isFeatured: true,
    isSignatureSpotlight: false,
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
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Breez commands a prime position within Dubai Maritime City, offering direct maritime views, yacht club proximity, and Danube’s celebrated flexible payment structure.',
    keyFeatures: [
      'Direct Arabian Gulf Open Sea Views',
      'Over 40 Resort-Style Amenities',
      'Infinity Pool Overlooking Port Rashid Yacht Marina',
      'Paddle Tennis Court & Sunset Observation Deck',
    ],
    handoverDate: 'Q1 2028',
    paymentPlan: '65% During Construction / 35% on Handover',
    isFeatured: false,
    isSignatureSpotlight: false,
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
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'A boutique coastal enclave featuring private plunge pools integrated into every residence terrace, offering an endless holiday atmosphere across the emerging Dubai Islands masterplan.',
    keyFeatures: [
      'Private Terrace Plunge Pool in Every Apartment',
      'Direct Private Beach Access',
      'Wellness Spa & Hydrotherapy Suite',
      'High Projected Capital Appreciation Corridor',
    ],
    handoverDate: 'Q4 2026',
    paymentPlan: 'Flexible Monthly Milestone Structure',
    isFeatured: false,
    isSignatureSpotlight: false,
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
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Refined contemporary townhouses perched along the Dubai Harbour waterway, blending clean maritime geometry with private moorings and effortless access to Ain Dubai and JBR.',
    keyFeatures: [
      'Private Berth Allocation Options',
      'Rooftop Entertainment Sky-Terrace',
      'Floor-to-Ceiling Acoustic Glazing',
      'Private Internal Passenger Elevator',
    ],
    handoverDate: 'Q2 2026',
    paymentPlan: '60% Construction / 40% Completion',
    isFeatured: false,
    isSignatureSpotlight: false,
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
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'An extraordinary full-floor trophy residence offering 360-degree vistas across the open Gulf and Dubai skyline. Features bespoke interiors by Foster + Partners and Dorchester Collection private concierge management.',
    keyFeatures: [
      '360-Degree Panoramic Ocean & Skyline Views',
      'Private 25-Metre Cantilevered Infinity Pool',
      'Private Supercar Lift Directly into Gallery Foyer',
      'Managed Exclusively by Dorchester Collection',
      'Dedicated Temperature-Controlled Wine Pavilion',
    ],
    handoverDate: 'Immediate Private Handover',
    paymentPlan: 'Private Office Structured Settlement',
    isFeatured: true,
    isSignatureSpotlight: true,
  },
];

export const PROPERTY_CATEGORIES = [
  'All',
  'Apartments',
  'Villas & Townhouses',
  'Off-plan',
  'Penthouses',
] as const;
