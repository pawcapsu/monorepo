import { BotCommand } from '@app/services';
import { Bot, InlineKeyboard } from 'grammy';
import { InlineQueryResultPhoto } from '@grammyjs/types';
import { ApiService } from '../../services/Api.service';
import { v4 } from 'uuid';

export class SubscribeQuery implements BotCommand {
  private readonly api = new ApiService();

  public _escapeCharacters(string: string): string {
    ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'].forEach((symbol) => {
      string = string.replace(`${symbol}`, `\\${symbol}`);
    });

    return string;
  };

  initialize(bot: Bot) {
    // Creating inlineQuery
    bot.on("inline_query", async (ctx) => {
      // Getting parameters
      let tags = ctx.update.inline_query.query.split(" ");
      // Bot-related tags
      // -limit tag
      let limit: number;
      let limitTag = tags.filter((x) => x.includes('limit:'));
      if (limitTag.length > 0) {
        tags = tags.filter((x) => !x.includes('limit:'));
        limit = Number(limitTag[0].replace('limit:', ''));
        
        // Check
        if (limit > 30) {
          limit = 30;
        };

        if (limit < 1) {
          limit = 1;
        };
      } else {
        limit = 5;
      };

      // -page tag
      let page: number;
      let pageTag = tags.filter((x) => x.includes('page:'));
      if (pageTag.length > 0) {
        tags = tags.filter((x) => !x.includes('page:'));
        page = Number(pageTag[0].replace('page:', ''));

        // Check
        if (page > 750) {
          page = 750;
        };

        if (limit < 1) {
          page = 1;
        };
      };

      const images = await this.api.fetchManyByTags(tags, limit, { page });

      await ctx.answerInlineQuery(
        images.filter((image) => image.url)
        .map((image) => {
          return <InlineQueryResultPhoto>{
            id: v4(),
            type: 'photo',
            photo_url: image.url,
            thumb_url: image.url,
            // \n${ image.description != null ? `\n*Description*: ${ image.description.split('').length > 150 ? `${ this._escapeCharacters(image.description.slice(0, 150)) }\n[Full description](https://e621.net/posts/${ image.id })\n` : this._escapeCharacters(image.description) }` : '' }
            caption: `\n*Search criteria*: \`${ tags.join(", ") }\`\n*Source*: [Site page](https://e621.net/posts/${ image.id })`,
            parse_mode: 'MarkdownV2',
            reply_markup: new InlineKeyboard()
              .url('About this Bot', 'https://services.pawcapsu.ml/leggydog')
          }
        }),
        { cache_time: 10 }
      );
    });
  };
};