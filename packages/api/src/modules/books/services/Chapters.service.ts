import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UniversalText, UniversalTextDocument, BookChapter, BookChapterDocument, TextNodeObject, PictureNodeObject } from 'src/types/models';
import { ObjectId } from 'src/types';

import { UniversalTextService } from 'src/modules/text/services';
import { ENodeType } from '@app/shared';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel('bookChapter')
    private readonly chapterModel: Model<BookChapterDocument>,

    private readonly textService: UniversalTextService,
  ) {}

  // fetchContent
  public async fetchContent(
    chapterId: ObjectId
  ): Promise<UniversalText | undefined> {
    const textNode: TextNodeObject = {
      type: ENodeType.TEXT,
      content: 'Just a text node!'
    };

    const pictureNode: PictureNodeObject = {
      type: ENodeType.PICTURE,
      caption: 'Picture caption!',
      url: 'https://good.dog/best-dog.png'
    }
    
    const content = <UniversalText>{
      version: 0,
      nodes: [textNode]
    };

    return content;
  };

  // fetchBookChapters
  public async fetchBookChapters(
    bookId: ObjectId,

    options?: {
      limit?: number
    },
  ): Promise<BookChapter[] | undefined> {
    const chapters: BookChapter[] = [
      {
        bookId: '6116466d451854e3f37913e9',
        title: 'Test Chapter',
        description: 'Text Description',
        content: Types.ObjectId('6116466d451854e3f37913e9')
      }
    ];
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