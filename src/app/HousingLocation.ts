export interface HousingLocation {
  id?: string;
  photos?: string[];
  name?: string;
  city?: string;
  adress?: string;
  houseNumber?: string;
  street?: string;
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