import { ENodeType, IBookChapter } from "../../../../";

export interface IChapterTitleNode {
  index?: number;

  type: ENodeType.CHAPTER_TITLE;
  chapter: IBookChapter;
}
