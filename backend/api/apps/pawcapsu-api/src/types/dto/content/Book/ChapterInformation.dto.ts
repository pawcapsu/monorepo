import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ChapterInformationInput {
  @Field({ nullable: false })
  title: string;
}
