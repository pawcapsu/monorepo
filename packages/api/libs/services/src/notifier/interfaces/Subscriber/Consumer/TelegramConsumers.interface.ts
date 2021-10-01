import { EConsumerType } from "@app/services";
import { Chat } from "@grammyjs/types";

export { Chat };
// todo: +Chat type
export type ITelegramChatConsumer = {
  type: EConsumerType.TELEGRAM;
  chatId: number;
};
