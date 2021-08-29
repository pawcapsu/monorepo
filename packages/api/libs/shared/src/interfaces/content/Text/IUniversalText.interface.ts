import { EUniversalTextType } from "../../../";

export interface IUniversalText {
  version?: number;
  type?: EUniversalTextType;
  nodes?: Array<any>;
};