import { RelationalProp } from "@app/shared/enums";
import { IBookRating } from "../../interactions";
import { IUniversalText } from "../Text";
import { IBookChapter } from "./Chapter";

export interface IBook {
  // General information
  title: string;
  description: RelationalProp<IUniversalText | any>;

  // Creator information

  // Rating information
  likes: number,
  dislikes: number,
  ratings: Array<IBookRating | any>;

  // Chapters information
  chapters: Array<IBookChapter | any>;
};