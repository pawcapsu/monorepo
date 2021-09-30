import { EConsumerType } from "@app/services";

export type IDiscordChatConsumer = {
  type: EConsumerType.DISCORD,
  chatId: number,
};