import * as mongoose from 'mongoose';

export type RelationalProp<T> = T | mongoose.Schema.Types.ObjectId;