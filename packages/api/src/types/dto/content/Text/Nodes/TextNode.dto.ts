import { ENodeType, ITextNode } from '@app/shared';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TextNodeInput implements ITextNode {
  @Field(type => String, { defaultValue: ENodeType.TEXT })
  type: ENodeType.TEXT;

  @Field(type => String)
  content: string;
};