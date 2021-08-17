import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookRating, UserRating, UserRatingDocument, UserRatingType, UserRatingDirection } from 'src/types/models';
import { IUserRating } from '@pawcapsu/shared/src';
import * as mongoose from 'mongoose';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel('userRating') private readonly userRatingModel: Model<UserRatingDocument>
  ) {}

  // postRating
  async postRating() {
    const userRating = new this.userRatingModel({
      user: mongoose.Types.ObjectId('61163d119b31edce0323541d'),
      entity: mongoose.Types.ObjectId('6116466d451854e3f37913e9'),
      direction: UserRatingDirection.DISLIKE,
      type: UserRatingType.BOOK,
    });
    return await userRating.save();
  };

  // fetchLikes
  async fetchLikes(id: string | mongoose.Schema.Types.ObjectId, type: UserRatingType): Promise<Number> {
    const ratings = await this.fetchRatings(id, type);
    let likes: number = 0;

    ratings.forEach((rating) => {
      if (rating.direction === UserRatingDirection.LIKE) likes++;
    });

    return likes;
  };

  // fetchDislikes
  async fetchDislikes(id: string | mongoose.Schema.Types.ObjectId, type: UserRatingType): Promise<Number> {
    const ratings = await this.fetchRatings(id, type);
    let dislikes: number = 0;

    ratings.forEach((rating) => {
      if (rating.direction === UserRatingDirection.DISLIKE) dislikes++;
    });

    return dislikes;
  };

  // fetchRating
  async fetchRating(id: string | mongoose.Schema.Types.ObjectId, type: UserRatingType): Promise<BookRating | undefined> {
    const _id = typeof id === "string" ? mongoose.Types.ObjectId(id) : id;
    const rating = await this.userRatingModel.findOne({ _id: _id, type }).exec();
  
    // return BookRating
    if (type === UserRatingType.BOOK) {
      return this.extractBookRating(rating);
    };
  };

  // fetchRating[s]
  async fetchRatings(id: string | mongoose.Schema.Types.ObjectId, type: UserRatingType): Promise<BookRating[] | undefined>  {
    const _id = typeof id === "string" ? (<unknown>mongoose.Types.ObjectId(id)) as mongoose.Schema.Types.ObjectId : id;
    const bookRatings = await this.userRatingModel.find({ entity: _id, type }).exec();
  
    // return BookRating
    if (type === UserRatingType.BOOK) {
      const ratings: BookRating[] = [];
      bookRatings.forEach((rating) => {
        ratings.push(this.extractBookRating(rating));
      });
      
      return ratings;
    };
  }

  // private extractBookRating
  private extractBookRating(rating: UserRating): BookRating {
    return <BookRating>{
      _id: rating._id,
      user: rating.user,
      book: rating.entity,
      direction: rating.direction,
      posted: rating.posted,
    };
  };
};