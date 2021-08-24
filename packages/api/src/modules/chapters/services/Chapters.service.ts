import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UniversalText, BookChapter, BookChapterDocument, Profile, BookDocument } from 'src/types/models';
import { ObjectId } from 'src/types';

import { arrayMoveMutable } from '@app/shared/helpers';
import { UniversalTextService } from 'src/modules/text/services';
import { ChapterInformationInput } from 'src/types/dto';
import { UserPermissionsService } from 'src/modules/permissions/services';
import { BooksService } from 'src/modules/books/services';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel('bookChapter')
    private readonly chapterModel: Model<BookChapterDocument>,

    @InjectModel('book')
    private readonly bookModel: Model<BookDocument>,
    
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
  public async updateChapter(
    user: Profile,
    
    chapterId: ObjectId,
    information: ChapterInformationInput,
  ): Promise<BookChapter> {
    const chapter = await this.fetchChapter(chapterId);

    if (chapter) {
      // +todo
      if (true) {
        // Updating chapter
        await this.chapterModel.updateOne({ _id: chapter._id }, information);
        return await this.fetchChapter(chapter._id);
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid chapterId argument', HttpStatus.BAD_REQUEST);
    };
  };

  // deleteChapter
  public async deleteChapter(
    user: Profile,

    chapterId: ObjectId,
  ): Promise<BookChapter> {
    // Getting book
    const chapter = await this.fetchChapter(chapterId);
    
    if (chapter) {
      // Checking write permissions
      if (true) {
        // Changing ids of fromChapter and toChapter
        await this.chapterModel.deleteOne({ _id: chapterId });
        return chapter;
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid chapterId argument', HttpStatus.BAD_REQUEST);
    };
  };

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

  // moveChapter
  public async moveChapter(
    user: Profile,
    bookId: ObjectId,

    fromChapterId: ObjectId,
    toChapterId: ObjectId,
  ): Promise<BookChapter[]> {
    // Getting book
    const book = await this.bookService.fetchBook(bookId);
    
    if (book) {
      // Checking write permissions
      if (this.permissionsService._checkWritePermissions(user._id, book)) {
        // Changing positions in book.chaptersPositions
        const positions = await this.fetchPositions(bookId);
        arrayMoveMutable(
          positions, 
          positions.indexOf(positions.find((x) => x == fromChapterId)), 
          positions.indexOf(positions.find((x) => x == toChapterId))
        );

        // Updating database
        await this.bookModel.updateOne({ _id: bookId }, { chaptersPositions: positions });
        
        return await this.fetchBookChapters(bookId);
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid bookId argument', HttpStatus.BAD_REQUEST);
    };
  };

  // fetchPositions
  public async fetchPositions(
    bookId: ObjectId,
  ): Promise<ObjectId[]> {
    const book = await this.bookService.fetchBook(bookId);
    const chapters = await this.fetchBookChapters(bookId);

    return [...book.chaptersPositions, ...chapters.filter((x) => !book.chaptersPositions?.includes(x._id)).map((x) => x._id)];
  };

  // _positionChapters
  public _positionChapters(
    chapters: BookChapter[],
    positions: ObjectId[],
  ) {
    const positionedChapters: BookChapter[] = [];
    positions.forEach((p) => {
      positionedChapters.push(chapters.find((x) => x._id == p));
    });

    return positionedChapters;
  };

  // fetchChapter
  public async fetchChapter(
    chapterId: ObjectId,
  ): Promise<BookChapter | undefined> {
    return await this.chapterModel.findOne({ _id: chapterId }).exec();
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

  public async _applyFilters(chapters: BookChapter[], options?: { limit?: number }) {
    // Filters
    let filteredChapters: BookChapter[] = chapters;
  
    // options: limit
    if (options?.limit) {
      filteredChapters = filteredChapters.slice(0, options.limit);
    };

    return filteredChapters;
  };
};