import { RelationalProp } from "../../../../enums";
import { IBook } from "../../../content";
import { IProfile } from "../../../users";
import { EUserRatingDirection } from "../../../../enums";

export interface IBookRating {
  user: RelationalProp<IProfile>,
  book: RelationalProp<IBook>,
  direction: EUserRatingDirection,
  posted: Date,
};