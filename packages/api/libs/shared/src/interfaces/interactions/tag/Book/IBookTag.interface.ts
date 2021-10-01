import { IUniversalText } from "../../../../interfaces";
import { RelationalProp } from "../../../../enums";
import { IProfile } from "../../../users";

export interface IBookTag {
  icon?: string;
  title: string;
  description?: RelationalProp<IUniversalText>;

  creator?: RelationalProp<IProfile | any>;
}
