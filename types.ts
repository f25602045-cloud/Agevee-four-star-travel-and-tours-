
export enum UserType {
  TOURIST = 'TOURIST',
  AGENCY = 'AGENCY',
  HOTEL = 'HOTEL',
  GUIDE = 'GUIDE',
  ADMIN = 'ADMIN',
}

export interface District {
  id: string;
  name: string;
  description: string;
  image: string;
  attractions: string[];
  coordinates: { lat: number; lng: number };
  gallery?: string[];
}

export interface RoomOption {
  id: string;
  name: string;
  price: number;
  capacity: number;
  features: string[];
}

export interface TourPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

export interface Listing {
  id: string;
  name: string;
  type: 'HOTEL' | 'AGENCY' | 'GUIDE';
  districtId: string;
  description: string;
  priceLevel: 1 | 2 | 3 | 4 | 5; // $ to $$$$$
  rating: number;
  contact: string;
  image: string;
  features: string[];
  rooms?: RoomOption[];
  packages?: TourPackage[];
  coordinates?: { lat: number; lng: number };
  status?: 'APPROVED' | 'PENDING';
  ownerId?: string; // Link listing to specific user
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  isApproved: boolean;
  password?: string;
  createdAt?: string;
  isBlocked?: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'DANGER';
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  type: UserType;
  details?: string;
}

export interface PlaceInfo {
  name: string;
  description: string;
  image?: string;
}

export interface DistrictDetails {
  overview: string;
  naturalPlaces: PlaceInfo[];
  historicalPlaces: PlaceInfo[];
  hotels: PlaceInfo[];
}

export interface DistrictLiveStatus {
  name: string;
  weather: {
    temp: string;
    condition: string;
  };
  roadStatus: {
    status: 'OPEN' | 'CLOSED' | 'CAUTION';
    details: string;
  };
  advisory: string;
}

export interface LiveStatusResponse {
  lastUpdated: string;
  generalAlerts: string[];
  districts: DistrictLiveStatus[];
}

export interface Booking {
  id: string;
  userId: string; // The tourist who booked
  listingId: string;
  listingName: string;
  ownerId?: string; // The business owner
  date: string;
  details: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'REJECTED';
  totalPrice: number;
  createdAt: string;
}
