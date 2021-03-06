import { ETagType, RelationalProp } from "../../../enums";
import { IProfile } from "../../users";

export interface ITag {
  type: ETagType;

  icon?: string;
  title: string;
  description?: string;
  color?: string;

  creator?: RelationalProp<IProfile | any>;
}
