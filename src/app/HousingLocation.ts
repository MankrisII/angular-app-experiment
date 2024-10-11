export interface HousingLocation {
  id?: string;
  photos?: string[];
  name?: string;
  city?: string;
  city_insensitive?: string;
  address?: string;
  address_insensitive?: string;
  houseNumber?: number;
  street?: string;
  street_insensitive?: string;
  postalCode?: string;
  coords?: HousingLocationCoords;
  availableUnits?: number;
  wifi?: boolean;
  laundry?: boolean;
}

export interface HousingLocationCoords {
  lat?: string;
  lon?: string;
}