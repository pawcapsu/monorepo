import { IBookRating } from "../../interactions";
import { IBookChapter } from "./Chapter";

export interface IBook {
  // General information
  title: string;
  description: string;

  // Creator information

  // Rating information
  likes: number,
  dislikes: number,
  ratings: Array<IBookRating | any>;

  // Chapters information
  chapters: Array<IBookChapter | any>;
};