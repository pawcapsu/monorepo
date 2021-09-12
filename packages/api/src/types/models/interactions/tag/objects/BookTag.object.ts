import { ObjectType, Field } from "@nestjs/graphql";
import { Profile } from 'src/types/models';
import { RelationalProp, IBookTag } from "@app/shared";
import { ObjectId } from 'src/types';

@ObjectType()
export class BookTag implements IBookTag {
  @Field(type => String, { nullable: false })
  _id: ObjectId;

  @Field(type => String, { nullable: true })
  icon?: string;
  
  @Field(type => String, { nullable: true })
  title: string;

  @Field(type => String, { nullable: true })
  description?: string

  @Field(type => Profile, { nullable: true })
  creator?: RelationalProp<Profile>
};