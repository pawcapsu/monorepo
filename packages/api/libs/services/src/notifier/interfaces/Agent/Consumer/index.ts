import { ITelegramChatConsumer } from "./TelegramConsumers.interface";
import { IDiscordChatConsumer } from "./DiscordConsumers.interface";

export * from './TelegramConsumers.interface';
export * from './DiscordConsumers.interface';

export type TScrapperConsumer = ITelegramChatConsumer | IDiscordChatConsumer;