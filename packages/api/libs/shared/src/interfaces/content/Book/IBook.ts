import { RelationalProp } from "../../../enums";
import { ObjectId } from "mongoose";
import { IBookRating } from "../../interactions";
import { IUniversalText } from "../Text";
import { IBookChapter } from "./Chapter";
import { IProfile } from "../../users";
import { IBookTag } from "../../interactions";

export interface IBook {
  // General information
  title: string;
  description: RelationalProp<IUniversalText | any>;

  // Creator information
  creator: RelationalProp<IProfile | any>;

  // Rating information
  likes: number;
  dislikes: number;
  ratings: Array<IBookRating | any>;

  // Chapters information
  chapters: Array<IBookChapter | any>;
  chaptersPositions: Array<ObjectId | any>;

  // Meta-information
  bookSize: number;
  tags: Array<ObjectId | any>;
}
