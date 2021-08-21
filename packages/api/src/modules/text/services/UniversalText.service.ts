import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UniversalText, UniversalTextDocument } from 'src/types/models';
import { Model } from 'mongoose';
import { ObjectId } from 'src/types';
import { UNodeEntity } from '@app/shared';

@Injectable()
export class UniversalTextService {
  constructor(
    @InjectModel('universalText')
    private readonly textModel: Model<UniversalTextDocument>,
  ) {}

  // createText
  async createText(
    nodes: Array<UNodeEntity>
  ): Promise<UniversalText> {
    const universal = new this.textModel({
      version: 0,
      nodes: nodes,
    });
    return await universal.save();
  };

  // addNode
  async addNode(
    id: ObjectId,
    node: UNodeEntity,
  ): Promise<UniversalText | undefined> {
    const text = await this.fetchText(id);

    if (text) {
      // +todo
      text.nodes.push(node);
      await this.textModel.updateOne({ _id: text._id }, text)
    };

    return text;
  };

  // removeNode

  // moveNode (+todo)

  // fetchText
  async fetchText(
    id: ObjectId
  ): Promise<UniversalText | undefined> {
    return await this.textModel.findOne({ _id: id }).exec();
  };
};