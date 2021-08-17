import { 
  UserRatingType,
  UserRatingEntity,
  UserRatingDirection,
} from "../../../enums";
import { RelationalProp } from "../../../enums";
import { IProfile } from '../../../';

export interface IUserRating {
  type?: UserRatingType,
  user: RelationalProp<IProfile>,
  entity: RelationalProp<UserRatingEntity>
  direction?: UserRatingDirection,
  posted?: Date,
};