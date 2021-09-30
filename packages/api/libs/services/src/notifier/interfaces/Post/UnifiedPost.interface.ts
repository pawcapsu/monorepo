import { EMessageActionType } from "@app/services";

export interface UnifiedPost {
  _actionType?: EMessageActionType

  // Common properties
  id: number,
  url: string,

  // Text properties (description, tags and so on)
  description: string,

  // Social properties
  score: number,
};