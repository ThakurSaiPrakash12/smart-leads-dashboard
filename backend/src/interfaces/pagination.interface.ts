export interface IPaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface IPaginatedResponse<T> {
  readonly data: T[];
  readonly pagination: IPaginationMeta;
}
