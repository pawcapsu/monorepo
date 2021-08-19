import { ObjectType, Field } from "@nestjs/graphql";
import { IPictureNode, ENodeType } from '@app/shared';

@ObjectType('PictureNode')
export class PictureNodeObject implements IPictureNode {
  @Field(type => String)
  type: ENodeType.PICTURE;
   
  @Field()
  caption: string;

  @Field()
  url: string;
};