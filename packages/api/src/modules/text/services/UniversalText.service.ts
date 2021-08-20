import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UniversalText, UniversalTextDocument } from 'src/types/models';
import { Model } from 'mongoose';
import { ObjectId } from 'src/types';

@Injectable()
export class UniversalTextService {
  constructor(
    @InjectModel('universalText')
    private readonly textModel: Model<UniversalTextDocument>,
  ) {}

  // createText

  // updateText (+todo)

  // fetchText
  async fetchText(
    id: ObjectId
  ): Promise<UniversalText | undefined> {
    return await this.textModel.findOne({ _id: id }).exec();
  };

};