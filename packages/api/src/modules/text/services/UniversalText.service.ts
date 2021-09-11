import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, UniversalText, UniversalTextDocument } from 'src/types/models';
import { Model } from 'mongoose';
import { ObjectId } from 'src/types';
import { UNodeEntity } from '@app/shared';
import { UserPermissionsService } from 'src/modules/permissions/services';
import { arrayMoveMutable } from '@app/shared/helpers';

@Injectable()
export class UniversalTextService {
  constructor(
    @InjectModel('universalText')
    private readonly textModel: Model<UniversalTextDocument>,

    private readonly permissionsService: UserPermissionsService,
  ) {}

  // createText
  async createText(
    nodes: Array<UNodeEntity>
  ): Promise<UniversalText> {
    const universal = new this.textModel({
      version: 0,
      nodes: nodes,
    });

    return this._prepareText(await universal.save());
  };

  // addNode
  async addNode(
    user: Profile,
    id: ObjectId,
    node: UNodeEntity,
  ): Promise<UniversalText | undefined> {
    const text = await this.fetchText(id);
    
    if (text != null) {
      if (this.permissionsService._checkTextWritePermissions(user._id, text)) {
        // +todo
        text.nodes.push(node);
        await this.textModel.updateOne({ _id: text._id }, text)
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid nodeId', HttpStatus.BAD_REQUEST);
    };

    return this._prepareText(text);
  };

  // modifyNode
  async modifyNode(
    user: Profile,
    id: ObjectId,
    nodeId: number,
    updatedNode: UNodeEntity,
  ): Promise<UniversalText | undefined> {
    const text = await this.fetchText(id);
    
    if (text != null) {
      const nodes = this._indexNodes(text.nodes);
      
      if (this.permissionsService._checkTextWritePermissions(user._id, text)) {
        // +todo
        Object.assign(nodes.find((x) => x.index === nodeId), updatedNode);
        await this.textModel.updateOne({ _id: text._id }, text);
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid nodeId', HttpStatus.BAD_REQUEST);
    };

    return this._prepareText(text);
  };

  // deleteNode
  async deleteNode(
    user: Profile,
    id: ObjectId,
    nodeId: number,
  ) {
    const text = await this.fetchText(id);
    
    if (text !== null) {
      const nodes = this._indexNodes(text.nodes);

      if (this.permissionsService._checkTextWritePermissions(user._id, text)) {
        const nodeToDelete = nodes.find((x) => x.index === nodeId);
        
        // +todo
        if (nodeToDelete) {
          const index = nodes.indexOf(nodeToDelete);
          
          nodes.splice(index, 1);
          text.nodes = nodes;

          await this.textModel.updateOne({ _id: text._id }, text);
        }
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid UniversalTextId', HttpStatus.BAD_REQUEST);
    };

    return this._prepareText(text);
  };

  // moveNode
  async moveNode(
    user: Profile,
    id: ObjectId,
    fromNodeId: number,
    toNodeId: number,
  ): Promise<UniversalText> {
    const text = await this.fetchText(id);
    
    if (text !== null) {
      const nodes = this._indexNodes(text.nodes);
      
      if (this.permissionsService._checkTextWritePermissions(user._id, text)) {
        // +todo
        const fromNode = Object.assign({}, nodes.find((x) => x.index === fromNodeId));
        const toNode = Object.assign({}, nodes.find((x) => x.index === toNodeId));

        if (fromNode && toNode) {
          // assigning fromNode to toNode
          Object.assign(nodes.find((x) => x.index === fromNodeId), toNode);

          // assigning toNode to fromNode
          Object.assign(nodes.find((x) => x.index === toNodeId), fromNode);

          // updating database
          await this.textModel.updateOne({ _id: text._id }, text);
        } else {
          throw new HttpException('Invalid fromNodeId or toNodeId', HttpStatus.BAD_REQUEST);
        };
      } else {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      };
    } else {
      throw new HttpException('Invalid nodeId', HttpStatus.BAD_REQUEST);
    };
    
    return this._prepareText(text);
  };

  // fetchText
  async fetchText(
    id: ObjectId
  ): Promise<UniversalText | undefined> {
    const text = await this.textModel.findOne({ _id: id }).exec();

    if (text !== null) {
      return this._prepareText(text);
    } else {
      return null;
    };
  };

  // _prepareUniversalText
  public _prepareText(
    text: UniversalText,
  ): UniversalText | undefined {
    // preparing nodes
    if (text.nodes) text.nodes = this._indexNodes(text?.nodes);

    return text;
  };

  // _indexNodes
  public _indexNodes(
    nodes: Array<UNodeEntity>
  ): Array<UNodeEntity> {
    let index = 0;

    return nodes.map((node) => {
      index++;

      node.index = index;
      return node;
    });
  };
};