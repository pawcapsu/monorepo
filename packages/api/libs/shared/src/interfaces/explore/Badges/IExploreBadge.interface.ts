import { RelationalProp, IUniversalText } from "../../..";

export interface IExploreBadge {
  color: string,
  title: string,
  description: RelationalProp<IUniversalText>,
  actions: Array<string>,
};