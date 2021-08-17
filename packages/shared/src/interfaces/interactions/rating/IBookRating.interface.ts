import { RelationalProp } from "../../../enums";
import { IBook } from "../../content";
import { IProfile } from "../../users";

export interface IBookRating {
  user: RelationalProp<IProfile>,
  book: RelationalProp<IBook>,
  direction: String,
  posted: Date,
};