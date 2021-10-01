import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  BookRating,
  UserRating,
  UserRatingDocument,
} from "@pawcapsu/types/models";
import { EUserRatingType, EUserRatingDirection } from "@app/shared";
import { ObjectId } from "@pawcapsu/types";
import * as mongoose from "mongoose";

@Injectable()
export class RatingService {
  constructor(
    @InjectModel("userRating")
    private readonly userRatingModel: Model<UserRatingDocument>
  ) {}

  // postRating
  async postRating() {
    const userRating = new this.userRatingModel({
      user: mongoose.Types.ObjectId("61163d119b31edce0323541d"),
      entity: mongoose.Types.ObjectId("6116466d451854e3f37913e9"),
      direction: EUserRatingDirection.DISLIKE,
      type: EUserRatingType.BOOK,
    });
    return await userRating.save();
  }

  // fetchLikes
  async fetchLikes(id: ObjectId, type: EUserRatingType): Promise<Number> {
    const ratings = await this.fetchRatings(id, type);
    let likes: number = 0;

    ratings.forEach((rating) => {
      if (rating.direction === EUserRatingDirection.LIKE) likes++;
    });

    return likes;
  }

  // fetchDislikes
  async fetchDislikes(id: ObjectId, type: EUserRatingType): Promise<Number> {
    const ratings = await this.fetchRatings(id, type);
    let dislikes: number = 0;

    ratings.forEach((rating) => {
      if (rating.direction === EUserRatingDirection.DISLIKE) dislikes++;
    });

    return dislikes;
  }

  // fetchRating
  async fetchRating(
    id: ObjectId,
    type: EUserRatingType
  ): Promise<BookRating | undefined> {
    const _id = typeof id === "string" ? mongoose.Types.ObjectId(id) : id;
    const rating = await this.userRatingModel
      .findOne({ _id: _id, type })
      .exec();

    // return BookRating
    if (type === EUserRatingType.BOOK) {
      return this._extractBookRating(rating);
    }
  }

  // fetchRating[s]
  async fetchRatings(
    id: ObjectId,
    type: EUserRatingType,

    options?: {
      limit?: number;
      direction?: EUserRatingDirection;
    }
  ): Promise<BookRating[] | undefined> {
    const _id = typeof id === "string" ? mongoose.Types.ObjectId(id) : id;
    const bookRatings = await this.userRatingModel
      .find({ entity: _id, type })
      .exec();

    // return BookRating
    if (type === EUserRatingType.BOOK) {
      const ratings: BookRating[] = [];
      bookRatings.forEach((rating) => {
        ratings.push(this._extractBookRating(rating));
      });

      return this._applyOptions(ratings, options);
    }
  }

  private _applyOptions(
    ratings: BookRating[],
    options?: { limit?: number; direction?: EUserRatingDirection }
  ) {
    let filteredRatings: BookRating[] = ratings;

    // options: direction
    // LIKE, DISLIKE
    if (options?.direction) {
      filteredRatings = filteredRatings.filter(
        (x) => x.direction == options.direction
      );
    }

    // options: limit
    if (options?.limit) {
      filteredRatings = filteredRatings.slice(0, options.limit);
    }

    return filteredRatings;
  }

  // private extractBookRating
  private _extractBookRating(rating: UserRating): BookRating {
    return <BookRating>{
      _id: rating._id,
      user: rating.user,
      book: rating.entity,
      direction: rating.direction,
      posted: rating.posted,
    };
  }
}
