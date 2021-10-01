import {
  EUserRatingType,
  TUserRatingEntity,
  EUserRatingDirection,
} from "../../../enums";
import { RelationalProp } from "../../../enums";
import { IProfile } from "../../../";

export interface IUserRating {
  type?: EUserRatingType;
  user: RelationalProp<IProfile>;
  entity: RelationalProp<TUserRatingEntity>;
  direction?: EUserRatingDirection;
  posted?: Date;
}
