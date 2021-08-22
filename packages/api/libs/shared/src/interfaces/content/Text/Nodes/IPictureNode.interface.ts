import { ENodeType } from "../../../../enums";

// +todo
export interface IPictureNode {
  type: ENodeType.PICTURE,

  index?: number,
  
  url: string,
  caption: string
};