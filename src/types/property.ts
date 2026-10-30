export type TransactionType = 'buy' | 'rent' | 'commercial' | 'off-market';

export type PropertyCategory = 
  | 'penthouse'
  | 'waterfront-villa'
  | 'architectural-estate'
  | 'historic-townhouse'
  | 'commercial-tower'
  | 'chalet';

export interface RoomTour {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
}

export interface FloorPlan {
  level: string;
  areaSqFt: number;
  areaSqM: number;
  image: string;
  highlights: string[];
}

export interface NearbyPoint {
  category: 'aviation' | 'dining' | 'school' | 'marina' | 'culture';
  name: string;
  distance: string;
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  transaction: TransactionType;
  category: PropertyCategory;
  priceUSD: number;
  monthlyRentUSD?: number;
  location: {
    city: string;
    country: string;
    neighborhood: string;
    address: string;
    lat: number;
    lng: number;
  };
  specs: {
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
    areaSqM: number;
    lotSizeAcres?: number;
    yearBuilt: number;
    ceilingHeightFt?: number;
    parkingSpaces: number;
  };
  architect?: string;
  images: string[];
  virtualTours: RoomTour[];
  floorPlans: FloorPlan[];
  amenities: string[];
  nearby: NearbyPoint[];
  financials: {
    estimatedHoaMonthlyUSD: number;
    estimatedAnnualTaxesUSD: number;
    projectedRentalYieldPercent?: number;
    estimatedMonthlyRentalIncomeUSD?: number;
  };
  isFeatured?: boolean;
  isOffMarket?: boolean;
  status: 'available' | 'under-offer' | 'private-preview';
  overview: string;
  securityFeatures: string[];
}

export interface Advisor {
  id: string;
  name: string;
  role: string;
  region: string;
  image: string;
  phone: string;
  email: string;
  activeListingsCount: number;
  volumeClosed: string;
  languages: string[];
  bio: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AED' | 'JPY';
export type Unit = 'sqft' | 'sqm';

export interface FilterState {
  searchQuery: string;
  transaction: TransactionType | 'all';
  category: PropertyCategory | 'all';
  city: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  amenities: string[];
  sortBy: 'featured' | 'price-desc' | 'price-asc' | 'area-desc' | 'year-desc';
}
