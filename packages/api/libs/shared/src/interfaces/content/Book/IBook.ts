import { RelationalProp } from "@app/shared/enums";
import { ObjectId } from "mongoose";
import { IBookRating } from "../../interactions";
import { IUniversalText } from "../Text";
import { IBookChapter } from "./Chapter";
import { IProfile } from "../../users";

export interface IBook {
  // General information
  title: string;
  description: RelationalProp<IUniversalText | any>;

  // Creator information
  creator: RelationalProp<IProfile | any>;

  // Rating information
  likes: number,
  dislikes: number,
  ratings: Array<IBookRating | any>;

  // Chapters information
  chapters: Array<IBookChapter | any>;
  chaptersPositions: Array<ObjectId | any>;
};