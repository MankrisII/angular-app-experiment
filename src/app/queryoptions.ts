export interface Queryoptions {
  page?: number,
  perPage?: number,
  filterByName?: string,
  order?: {
    order?: string,
    by? : string
  }
}
