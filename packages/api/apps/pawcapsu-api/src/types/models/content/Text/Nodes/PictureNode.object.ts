import { ObjectType, Field } from "@nestjs/graphql";
import { IPictureNode, ENodeType } from "@app/shared";

@ObjectType("PictureNode")
export class PictureNodeObject implements IPictureNode {
  @Field((type) => ENodeType)
  type: ENodeType.PICTURE;

  @Field({ nullable: false })
  index: number;

  @Field()
  caption: string;

  @Field()
  url: string;
}
