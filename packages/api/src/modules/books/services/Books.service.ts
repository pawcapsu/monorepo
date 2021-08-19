import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from 'src/types/models';
import { Model } from 'mongoose';
import { ObjectId } from 'src/types';
import * as mongoose from 'mongoose';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('book') private readonly bookModel: Model<BookDocument>,
  ) {}

  // fetchBook
  async fetchBook(id: string): Promise<Book | undefined> {
    const _id = mongoose.Types.ObjectId(id);
    return await this.bookModel.findOne({ _id }).exec();
  };

  // fetchProfileBooks
  async fetchProfileBooks(
    id: ObjectId,
  
    options?: {
      limit: number
    },
  ): Promise<Book[] | undefined> {
    const books: Book[] = await this.bookModel.find({ creator: id }).exec();
    return this._applyOptions(books, options);
  };

  private _applyOptions(books: Book[], options?: { limit?: number }) {
    let filteredBooks: Book[] = books;
  
    // options: limit
    if (options?.limit) {
      filteredBooks = filteredBooks.slice(0, options.limit);
    };

    return filteredBooks;    
  };
};