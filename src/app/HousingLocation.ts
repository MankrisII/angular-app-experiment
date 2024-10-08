export interface HousingLocation {
  id?: string;
  photos?: string[];
  name?: string;
  city?: string;
  adress?: string;
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