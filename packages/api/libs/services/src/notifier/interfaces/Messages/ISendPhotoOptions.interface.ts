import { EParseMode } from "@app/services";

export interface ISendPhotoOptions {
  caption?: string,
  parse_mode?: EParseMode,
  reply_markup?: any,
};