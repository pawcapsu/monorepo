import { ENodeType, IBook } from "../../../../";

export interface IBookReviewNode {
  index?: number;

  type: ENodeType.BOOK_REVIEW;
  book: IBook;
}
