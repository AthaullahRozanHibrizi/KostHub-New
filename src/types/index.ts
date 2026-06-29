export type Role = "OWNER" | "TENANT";
export type KostType = "PUTRA" | "PUTRI" | "CAMPUR";
export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED";
export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Kost {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  province: string;
  latitude?: number | null;
  longitude?: number | null;
  type: KostType;
  images: string[];
  facilities: string[];
  rules: string[];
  isActive: boolean;
  ownerId: string;
  owner?: User;
  rooms?: Room[];
  reviews?: Review[];
  _count?: { reviews: number; rooms: number };
  avgRating?: number;
  minPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  priceYear?: number | null;
  size?: string | null;
  floor?: number | null;
  status: RoomStatus;
  images: string[];
  facilities: string[];
  kostId: string;
  kost?: Kost;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string | null;
  tenantId: string;
  tenant?: User;
  kostId: string;
  kost?: Kost;
  roomId: string;
  room?: Room;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  kostId: string;
  kost?: Kost;
  createdAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user?: User;
  kostId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  type?: KostType;
  minPrice?: number;
  maxPrice?: number;
  facilities?: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
