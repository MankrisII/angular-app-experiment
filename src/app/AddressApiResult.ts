export interface AddressListItem {
  selected: boolean;
  data: AddressApiResult;
  id: number;
}
export interface AddressApiResult {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: string[];
}

export interface Properties {
  label: string;
  score: number;
  id: string;
  banId: string;
  name: string;
  postcode: string;
  citycode: string;
  housenumber: string;
  x: number;
  y: number;
  city: string;
  context: string;
  type: string;
  importance: number;
  street: string;
}
