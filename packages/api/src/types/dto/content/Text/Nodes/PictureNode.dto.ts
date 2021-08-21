import { ENodeType, IPictureNode, ITextNode } from '@app/shared';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PictureNodeInput implements IPictureNode {
  @Field(type => String, { defaultValue: ENodeType.PICTURE })
  type: ENodeType.PICTURE;

  @Field(type => String)
  caption: string;

  @Field(type => String)
  url: string;
};