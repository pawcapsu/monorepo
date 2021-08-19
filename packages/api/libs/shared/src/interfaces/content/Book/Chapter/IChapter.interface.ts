import { IChapterRating } from "../../../";
import { IUniversalText } from "../../Text";
import { IChapterEditor } from "./IChapterEditor.interface";
import { RelationalProp } from "../../../../";
import { IBook } from "../IBook";

export interface IBookChapter {
  // General information
  title: string;
  description: string;

  bookId: RelationalProp<IBook>;

  // Content itself
  content?: RelationalProp<IUniversalText>;

  // Editors information
  editors?: Array<IChapterEditor>;

  // +todo
  // Comments
  comments?: Array<any>;

  // Ratings
  ratings?: Array<IChapterRating>;
}