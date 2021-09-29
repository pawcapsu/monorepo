import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AddNodeOptions {
  @Field({ nullable: true })
  addAfter: number;
};