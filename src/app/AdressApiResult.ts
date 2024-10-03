export interface AdressListItem {
  selected: boolean;
  data: AdressApiResult;
  id: number;
}
export interface AdressApiResult {
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
