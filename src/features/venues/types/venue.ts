export type Venue = {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;
  media: VenueMedia[];
  bookings?: VenueBooking[];
  owner?: VenueOwner;
};

export type VenueOwner = {
  name: string;
  email: string;
  bio: string;
  avatar: VenueMedia;
  banner: VenueMedia;
};

export type VenueBooking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
};

export type VenueMeta = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

export type VenueLocation = {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number | null;
  lng: number | null;
};

export type VenueMedia = {
  url: string;
  alt: string;
};

export type PaginationMeta = {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
};

export interface ApiResponse<T> {
  data: T;
  meta: PaginationMeta;
}
