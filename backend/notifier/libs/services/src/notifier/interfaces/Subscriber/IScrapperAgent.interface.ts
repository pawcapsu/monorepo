import { TScrapperConsumer } from "@app/services";
import { ObjectId } from "@app/services";
import { EScrapperAgentType } from "../..";

export interface IScrapperAgent<T> {
  _id: ObjectId;

  // Common scrapper properties
  type: EScrapperAgentType;
  consumer: TScrapperConsumer;

  // Type-defined data
  data: T;

  // Status-related data
  lastPostId?: String;
}
