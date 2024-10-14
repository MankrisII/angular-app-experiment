export interface Queryoptions {
  page?: number;
  perPage?: number;
  filterByName?: string;
  houseNumber?: number;
  street_insensitive?: string;
  orderBy?: {
    order: string;
    by: string;
  }[];
}
