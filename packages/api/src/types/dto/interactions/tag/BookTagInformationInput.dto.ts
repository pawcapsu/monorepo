import { BookTagInformation } from '@app/shared/dtos';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class BookTagInformationInput implements BookTagInformation {
  @Field({ nullable: true })
  icon: string;

  @Field({ nullable: false })
  title: string;
};