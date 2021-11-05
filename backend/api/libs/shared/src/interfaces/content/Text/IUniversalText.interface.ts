import { EUniversalTextType, UNodeEntity } from "../../../";

export interface IUniversalText {
  version?: number;
  type?: EUniversalTextType;
  nodes?: Array<UNodeEntity>;
}
