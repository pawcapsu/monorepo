import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import { ObjectId } from "@pawcapsu/types";
import {
  ExploreBadge,
  ExploreBadgeDocument,
  PaginatedExploreBadges,
  UniversalText,
} from "@pawcapsu/types/models";
import { UniversalTextService } from "@pawcapsu/modules/text/services";
import * as mongoose from "mongoose";
import { ExploreBadgesSearchOptions } from "@app/shared";

@Injectable()
export class ExploreBadgeService {
  constructor(
    @InjectModel("exploreBadge")
    private readonly badgeModel: PaginateModel<ExploreBadgeDocument>,

    private readonly textService: UniversalTextService
  ) {}

  // fetchBadge
  public async fetchBadge(id: ObjectId): Promise<ExploreBadge | null> {
    return await this.badgeModel.findOne({ _id: id }).exec();
  }

  // fetchBadges
  public async fetchBadges(
    page: number,
    options?: ExploreBadgesSearchOptions
  ): Promise<PaginatedExploreBadges> {
    const limit = options?.limit ?? 5;
    const query = this._buildFindOptions(options);

    // const test = new this.badgeModel({
    //   title: 'Новое',
    //   color: 'bg-blue-500',
    //   actions: ['sortByNew']
    // });

    // await test.save();

    return await this.badgeModel.paginate(query, {
      page,
      limit,
    });
  }

  private _buildFindOptions(
    options: ExploreBadgesSearchOptions
  ): mongoose.FilterQuery<ExploreBadgeDocument> {
    return {};
  }

  // fetchDescription
  public async fetchDescription(id: ObjectId): Promise<UniversalText> {
    // Fetching this ExploreBadge
    const badge = await this.fetchBadge(id);

    if (badge) {
      let text = await this.textService.fetchText(badge.description);

      if (text == null) {
        // Creating new universal text and updating badge model
        text = await this.textService.createText([]);

        // Updating this exploreBadge
        badge.description = text._id;
        await this.badgeModel.updateOne({ _id: badge._id }, badge);

        return text;
      } else {
        return text;
      }
    } else {
      throw new HttpException("Document not found", HttpStatus.NOT_FOUND);
    }
  }
}
