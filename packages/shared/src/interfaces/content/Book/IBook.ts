import { RelationalProp } from "../../..";

export interface IBook {
  // General information
  title: string;
  description: string;

  // Rating information
  likes: number,
  dislikes: number,
  ratings: Array<any>;
};