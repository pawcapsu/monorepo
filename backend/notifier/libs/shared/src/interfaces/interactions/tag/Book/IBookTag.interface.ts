import { IUniversalText } from "../../../../interfaces";
import { RelationalProp } from "../../../../enums";
import { IProfile } from "../../../users";

export interface IBookTag {
  icon?: string;

  title: string;
  description?: RelationalProp<IUniversalText>;
  color?: string;

  creator?: RelationalProp<IProfile | any>;
}
