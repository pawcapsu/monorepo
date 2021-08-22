import { ENodeType } from "../../../../enums";

export interface ITextNode {
  index?: number,

  type: ENodeType.TEXT,
  content: string,
};