import { IBook } from "./IBook";
// import { PaginateResult } from "mongoose";

// export type IPaginatedBooks = PaginateResult<IBook>;
export interface IPaginatedBooks {
  docs: IBook[];
  totalDocs: number;
  limit: number;
  page?: number | undefined;
  totalPages: number;
  nextPage?: number | null | undefined;
  prevPage?: number | null | undefined;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
  [customLabel: string]: IBook[] | number | boolean | null | undefined;
};