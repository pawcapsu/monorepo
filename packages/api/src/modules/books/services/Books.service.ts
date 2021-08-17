import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from 'src/types/models';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('book') private readonly bookModel: Model<BookDocument>,
  ) {}

  // testAddBook
  async testAddBook(uid: string, title: string, description: string) {
    const _id = mongoose.Types.ObjectId(uid);
    
    const book = new this.bookModel({ creator: _id, title, description });
    return await book.save();
  };

  // fetchBook
  async fetchBook(id: string): Promise<Book | undefined> {
    const _id = mongoose.Types.ObjectId(id);
    return await this.bookModel.findOne({ _id }).exec();
  };

  // fetchProfileBooks
  async fetchProfileBooks(id: mongoose.Schema.Types.ObjectId): Promise<Book[] | undefined> {
    const books = await this.bookModel.find({ creator: id }).exec();
    return books;
  };
};