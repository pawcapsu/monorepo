import { IBook } from "./IBook";
import { PaginateResult } from "mongoose";

export type IPaginatedBooks = PaginateResult<IBook>;
