import { IChannelAction } from ".";

export interface IChannelState {
  chat_id: number | string,
  action: IChannelAction,
};