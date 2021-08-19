import { ObjectType, Field } from "@nestjs/graphql";
import { ITextNode, ENodeType } from '@app/shared';

@ObjectType('TextNode')
export class TextNodeObject implements ITextNode {
  @Field(type => ENodeType)
  type: ENodeType.TEXT;
   
  @Field()
  content: string;
};