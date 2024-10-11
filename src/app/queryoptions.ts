export interface Queryoptions {
  page?: number;
  perPage?: number;
  filterByName?: string;
  street_insensitive?: string;
  orderBy?: {
    order: string;
    by: string;
  }[];
}
