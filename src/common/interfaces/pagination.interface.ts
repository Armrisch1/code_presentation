export interface PaginationBaseInterface {
  limit: number;
}

export interface PaginationObjectInterface extends PaginationBaseInterface {
  offset: number;
}

export interface PaginationResponseInterface<T = any> {
  rows: Array<T>;
  count: number;
}
