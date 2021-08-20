import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UniversalText, BookChapter, BookChapterDocument, Profile, Book } from 'src/types/models';
import { ObjectId } from 'src/types';

import { UniversalTextService } from 'src/modules/text/services';
import { ChapterInformationInput } from 'src/types/dto';
import { BooksService } from 'src/modules/books/services';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel('bookChapter')
    private readonly chapterModel: Model<BookChapterDocument>,
    
    private readonly bookService: BooksService,
    private readonly textService: UniversalTextService,
  ) {}

  // createChapter
  public async createChapter(
    user: Profile,
    bookId: ObjectId,

    information: ChapterInformationInput,
  ) {
    // Getting book
    const book = await this.bookService.fetchBook(bookId);

    if (book) {
      // Checking write permissions
      if (this._checkWritePermissions(user._id, book)) {
        // Creating new chapter
        const chapter = new this.chapterModel({
          title: information.title,
          bookId: book._id,
          description: information.description,
        });
        return chapter.save();
      };
    } else {
      throw new HttpException('Invalid bookId argument', HttpStatus.BAD_REQUEST);
    };
  };

  // updateChapter

  // deleteChapter

  // moveChapter(+todo)


  // fetchContent
  public async fetchContent(
    chapterId: ObjectId
  ): Promise<UniversalText | undefined> {
    const chapter = await this.chapterModel.findOne({ _id: chapterId }).exec();
    
    if (chapter) {
      return await this.textService.fetchText(chapter?.content);
    } else {
      return null;
    };
  };

  // fetchBookChapters
  public async fetchBookChapters(
    bookId: ObjectId,

    options?: {
      limit?: number
    },
  ): Promise<BookChapter[] | undefined> {
    const chapters = await this.chapterModel.find({ bookId }).exec();
    return this._applyFilters(chapters, options);
  };

  private _applyFilters(chapters: BookChapter[], options?: { limit?: number }) {
    let filteredChapters: BookChapter[] = chapters;
  
    // options: limit
    if (options?.limit) {
      filteredChapters = filteredChapters.slice(0, options.limit);
    };

    return filteredChapters;    
  };

  private async _checkWritePermissions(
    userId: ObjectId,
    book: Book,
  ): Promise<boolean> {
    // +todo
    if (book.creator == userId) {
      return true
    } else {
      throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
    };
  };
};