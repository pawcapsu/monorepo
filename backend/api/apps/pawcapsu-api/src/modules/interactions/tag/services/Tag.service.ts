import {
  BookTagInformation,
  ETagType,
  TagFilterOptions,
  TTagEntity,
} from "@app/shared";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BooksService } from "@pawcapsu/modules/books/services";
import { UserPermissionsService } from "@pawcapsu/modules/permissions/services";
import { UniversalTextService } from "@pawcapsu/modules/text/services";
import { ObjectId } from "@pawcapsu/types";
import {
  BookDocument,
  BookTag,
  Profile,
  Tag,
  TagDocument,
} from "@pawcapsu/types/models";

@Injectable()
export class TagService {
  constructor(
    @InjectModel("tag")
    private readonly tagModel: Model<TagDocument>,

    @InjectModel("book")
    private readonly bookModel: Model<BookDocument>,

    private readonly permissionsService: UserPermissionsService,
    private readonly bookService: BooksService,
    private readonly textService: UniversalTextService
  ) {}

  // createTag
  public async createTag(
    user: Profile,
    type: ETagType,

    information: BookTagInformation
  ) {
    // Checking write permissions
    // +todo
    if (true) {
      // Creating empty UniversalText object for tag's description
      const description = await this.textService.createText([]);
      let object = {};

      if (type === ETagType.BOOK) {
        // Creating new tag
        object = {
          type: ETagType.BOOK,
          icon: information.icon,
          title: information.title,
          description: description._id,
          creator: user._id,
        };
      }

      const tag = new this.tagModel(object);
      return await tag.save();
    } else {
      throw new HttpException("Insufficient permissions", HttpStatus.FORBIDDEN);
    }
  }

  // assignTag
  public async assignTag(
    user: Profile,
    type: ETagType,

    tagId: ObjectId,
    entityId: ObjectId
  ) {
    if (type === ETagType.BOOK) {
      const book = await this.bookService.fetchBook(entityId);

      if (book) {
        const tag = await this.fetchTag(tagId, ETagType.BOOK);

        if (tag) {
          if (this.permissionsService._checkWritePermissions(user._id, book)) {
            // Assigning this tag to this book
            book.tags.push(tag._id);

            await this.bookModel.updateOne(
              { _id: book._id },
              { tags: book.tags }
            );
            return this.bookService.fetchBook(book._id);
          } else {
            throw new HttpException(
              "Insufficient permissions",
              HttpStatus.FORBIDDEN
            );
          }
        } else {
          throw new HttpException("Unknown tag id", HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException("Unknown entity id", HttpStatus.BAD_REQUEST);
      }
    }
  }

  // fetchTag
  public async fetchTag(id: ObjectId, type: ETagType) {
    const tag = await this.tagModel.findOne({ _id: id, type }).exec();

    if (tag.type === ETagType.BOOK) {
      return this._extractBookTag(tag);
    }
  }

  // fetchTag[s]
  public async fetchTags(
    id: ObjectId,
    type: ETagType,

    filters?: TagFilterOptions
  ): Promise<BookTag[] | null> {
    if (type === ETagType.BOOK) {
      const book = await this.bookService.fetchBook(id);
      const bookTags: BookTag[] = [];

      for (const id of book.tags) {
        const tag = await this.tagModel.findOne({ _id: id }).exec();
        bookTags.push(this._extractBookTag(tag));
      }

      return this._applyFilters(bookTags, filters);
    }
  }

  // private _applyFilters
  private _applyFilters(tags: BookTag[], filters: TagFilterOptions): BookTag[] {
    let filteredTags = tags;

    // filter: limit
    if (filters?.limit) {
      filteredTags = filteredTags.slice(0, filters.limit);
    }

    return filteredTags;
  }

  // private _extractBookTag
  private _extractBookTag(tag: Tag) {
    return <BookTag>{
      _id: tag._id,
      title: tag.title,
      creator: tag.creator,
      description: tag.description,
      icon: tag.icon,
    };
  }
}
