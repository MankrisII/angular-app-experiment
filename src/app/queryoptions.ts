export interface Queryoptions {
  page?: number;
  perPage?: number;
  filterByName?: string;
  orderBy?: {
    order: string;
    by: string;
  }[];
}
