import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UniversalText, BookChapter, BookChapterDocument, Profile, Book, TextNodeObject } from 'src/types/models';
import { ObjectId } from 'src/types';

import { UniversalTextService } from 'src/modules/text/services';
import { ChapterInformationInput } from 'src/types/dto';
import { UserPermissionsService } from 'src/modules/permissions/services';
import { BooksService } from 'src/modules/books/services';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel('bookChapter')
    private readonly chapterModel: Model<BookChapterDocument>,
    
    private readonly permissionsService: UserPermissionsService,
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
      if (this.permissionsService._checkWritePermissions(user._id, book)) {
        // Creating empty UniversalText object for chapter's description
        const description = await this.textService.createText([]);

        // Creating empty UniversalText object for chapter's content
        const content = await this.textService.createText([]);

        // Creating new chapter
        const chapter = new this.chapterModel({
          title: information.title,
          bookId: book._id,
          description: description._id,
          content: content._id,
        });
        return await chapter.save();
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid bookId argument', HttpStatus.BAD_REQUEST);
    };
  };

  // updateChapter

  // deleteChapter

  // moveChapter(+todo)

  // fetchDescription
  public async fetchDescription(
    chapter: BookChapter
  ): Promise<UniversalText | undefined> {
    return await this.textService.fetchText(chapter?.description) || { _id: null, version: null, nodes: [] };
  };

  // fetchContent
  public async fetchContent(
    chapter: BookChapter,

    options?: {},
  ): Promise<UniversalText | string | undefined> {
    let text = await this.textService.fetchText(chapter?.content);

    // Creating UniversalText object and updating this chapter
    if (text == null) {
      text = await this.textService.createText([]);
      
      // +todo
      chapter.content = text._id;
      await this.chapterModel.updateOne({ _id: chapter._id }, chapter);
    };
    
    return text;
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
};