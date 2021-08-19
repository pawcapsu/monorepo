import { ENodeType } from "../../../../enums";

export interface ITextNode {
  type: ENodeType.TEXT,
  content: string,
};