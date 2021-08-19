import { RelationalProp } from "../../../../enums";
import { IBook, IBookChapter } from "../../../content";
import { IProfile } from "../../../users";
import { EUserRatingDirection } from "../../../../enums";

export interface IChapterRating {
  user: RelationalProp<IProfile>,
  book: RelationalProp<IBook>,
  chapter: RelationalProp<IBookChapter>,
  direction: EUserRatingDirection,
  posted: Date,
};