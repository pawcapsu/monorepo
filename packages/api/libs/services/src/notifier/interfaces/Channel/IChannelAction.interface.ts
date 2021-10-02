import { EChannelActionType } from "@app/services";

export interface IChannelAction {
  type: EChannelActionType,
  data?: any,
};