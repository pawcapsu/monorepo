import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from 'src/types/models';
import { Model, PaginateModel } from 'mongoose';
import { ObjectId } from 'src/types';
import * as mongoose from 'mongoose';
import { BookSearchOptions } from "@app/shared/dtos";
import { PaginatedBooks } from "src/types/models/content/Book/PaginatedBooks.model";

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('book') private readonly bookModel: PaginateModel<BookDocument>,
  ) {}

  // fetchBook
  async fetchBook(id: ObjectId): Promise<Book | undefined> {
    const _id = typeof id === "string" ? mongoose.Types.ObjectId(id) : id;
    return await this.bookModel.findOne({ _id }).exec();
  };

  // fetchBooks
  async fetchBooks(
    page: number,
    options: BookSearchOptions,
  ): Promise<PaginatedBooks> {
    const limit = options?.limit | 20;
    const query = this._buildFindOptions(options);

    return await this.bookModel.paginate(query, {
      page,
      limit,
    });
  };

  // fetchProfileBooks
  async fetchProfileBooks(id: ObjectId, options: BookSearchOptions): Promise<Book[] | undefined> {
    const books: Book[] = await this.bookModel.find({ creator: id }).exec();
    return this._applyOptions(books, options);
  };

  private _applyOptions(books: Book[], options: BookSearchOptions) {
    let filteredBooks: Book[] = books;
  
    // options: limit
    if (options?.limit) {
      filteredBooks = filteredBooks.slice(0, options.limit);
    };

    return filteredBooks;    
  };

  private _buildFindOptions(options: BookSearchOptions): mongoose.FilterQuery<BookDocument> {
    return {};
  };
};