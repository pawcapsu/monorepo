import { RelationalProp } from "@app/shared/enums";
import { IProfile } from "@app/shared/interfaces/users";

export interface IChapterEditor {
  user: RelationalProp<IProfile>;
}
