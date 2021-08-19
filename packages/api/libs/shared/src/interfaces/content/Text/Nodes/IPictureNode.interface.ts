import { ENodeType } from "../../../../enums";

// +todo
export interface IPictureNode {
  type: ENodeType.PICTURE,
  
  url: string,
  caption: string
};