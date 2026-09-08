export type MaterialCategory = 'paper' | 'cardboard' | 'plastic' | 'metal' | 'glass' | 'e_waste';

export type PickupStatus = 
  | 'requested' 
  | 'accepted' 
  | 'on_the_way' 
  | 'collected' 
  | 'completed' 
  | 'cancelled';

export type UserRole = 'customer' | 'collector' | 'recycler' | 'admin';

export interface RateItem {
  category: MaterialCategory;
  name: string;
  ratePerKg: number;
  unit: string;
  description: string;
  ecoBenefit: string;
  co2FactorKg: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  isOnline?: boolean;
  vehicle?: string;
  supportedMaterials?: MaterialCategory[];
}

export interface StatusTimelineEntry {
  status: PickupStatus;
  timestamp: string;
  note?: string;
}

export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  materialCategory: MaterialCategory;
  estimatedWeight: number;
  actualWeight?: number;
  ratePerKg?: number;
  totalValue?: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  preferredTime: string;
  notes?: string;
  wasteImageUrl?: string;
  aiClassification?: {
    category: MaterialCategory;
    confidence: number;
    detectedLabel: string;
    tips: string[];
  };
  status: PickupStatus;
  statusTimeline: StatusTimelineEntry[];
  receiptId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentalImpact {
  co2SavedKg: number;
  landfillDivertedKg: number;
  treesSavedFraction: number;
  waterSavedLiters: number;
}

export interface DigitalReceipt {
  id: string;
  receiptNumber: string;
  pickupId: string;
  customerId: string;
  customerName: string;
  collectorId: string;
  collectorName: string;
  materialCategory: MaterialCategory;
  materialName: string;
  actualWeight: number;
  ratePerKg: number;
  totalPayout: number;
  paymentMethod: 'Cash on Pickup' | 'Instant UPI' | 'Direct Transfer';
  timestamp: string;
  environmentalImpact: EnvironmentalImpact;
}

export interface RecyclerStock {
  category: MaterialCategory;
  name: string;
  currentStockKg: number;
  totalCollectedKg: number;
  lastUpdated: string;
  unitRate: number;
  estimatedValue: number;
}

export interface PlatformAnalytics {
  totalWasteCollectedKg: number;
  totalPayoutsINR: number;
  totalPickupsCompleted: number;
  activeHouseholds: number;
  activeCollectors: number;
  materialBreakdown: { [key in MaterialCategory]?: number };
  co2SavedTotalKg: number;
  treesSavedTotal: number;
}

export interface DemoSample {
  id: string;
  title: string;
  category: MaterialCategory;
  imageUrl: string;
  description: string;
}

export interface AIClassificationResult {
  category: MaterialCategory;
  categoryName: string;
  detectedLabel: string;
  subType: string;
  confidence: number;
  estimatedRatePerKg: number;
  recyclabilityRating: 'High' | 'Medium' | 'Special Handling';
  tips: string[];
  keyAttributes: {
    cleanliness: string;
    contaminationRisk: string;
    dryWaste: boolean;
  };
}

export interface MatchedCollector {
  collector: User;
  distanceKm: number;
  estimatedArrivalMinutes: number;
  matchScore: number;
  reasons: string[];
}

export interface RouteGroup {
  clusterId: string;
  clusterName: string;
  centerLat: number;
  centerLng: number;
  pickups: PickupRequest[];
  totalEstWeight: number;
  estimatedEarnings: number;
}