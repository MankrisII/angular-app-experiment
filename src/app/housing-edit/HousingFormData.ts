
export interface HousingFormData {
  id?: string;
  photos?: string[];
  name?: string;
  city?: string;
  adress?: string;
  postalCode?: string;
  coords?: HousingFormDataCoords;
  availableUnits?: number;
  wifi?: boolean;
  laundry?: boolean;
};

export interface HousingFormDataCoords {
  lat?: string;
  lon?: string;
}
