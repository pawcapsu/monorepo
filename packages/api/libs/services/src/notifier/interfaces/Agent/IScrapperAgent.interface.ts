import { TTelegramConsumer } from '@app/services';
import { ObjectId } from '@pawcapsu/types';
import { EScrapperAgentType } from '../..';

export interface IScrapperAgent<T> {
  _id: ObjectId,

  // Common scrapper properties
  type: EScrapperAgentType;
  consumer: TTelegramConsumer;

  // Type-defined data
  data: T;

  // Status-related data
  lastPostId?: String;
};