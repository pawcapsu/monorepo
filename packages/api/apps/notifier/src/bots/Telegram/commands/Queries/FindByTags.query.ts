import { BotCommand, EScrapperAgentType } from "@app/services";
import { Bot, InlineKeyboard } from "grammy";
import { InlineQueryResultPhoto } from "@grammyjs/types";
import { ApiService as E621ApiService } from "@notifier/services/Sources/E621";
import { ApiService as E926ApiService } from "@notifier/services/Sources/E926";
import { v4 } from "uuid";

export class SubscribeQuery implements BotCommand {
  private readonly E621Api = new E621ApiService();
  private readonly E926Api = new E926ApiService();

  public _escapeCharacters(string: string): string {
    [
      "_",
      "*",
      "[",
      "]",
      "(",
      ")",
      "~",
      "`",
      ">",
      "#",
      "+",
      "-",
      "=",
      "|",
      "{",
      "}",
      ".",
      "!",
    ].forEach((symbol) => {
      string = string.replace(`${symbol}`, `\\${symbol}`);
    });

    return string;
  }

  initialize(bot: Bot) {
    // Creating inlineQuery
    bot.on("inline_query", async (ctx) => {
      // Getting parameters
      let tags = ctx.update.inline_query.query.split(" ");

      // Bot-related tags
      // -from tag
      let from: EScrapperAgentType;
      // let fromTag = tags.filter((x) => x.includes('from:'));
      // if (fromTag.length > 0) {
      //   tags = tags.filter((x) => !x.includes('from:'));
      //   if (fromTag[0].replace('from:', '').includes('926')) {
      //     from = EScrapperAgentType.E926;
      //   } else {
      //     from = EScrapperAgentType.E621;
      //   };
      // };
      from = EScrapperAgentType.E621;

      // -limit tag
      let limit: number;
      let limitTag = tags.filter((x) => x.includes("limit:"));
      if (limitTag.length > 0) {
        tags = tags.filter((x) => !x.includes("limit:"));
        limit = Number(limitTag[0].replace("limit:", ""));

        // Check
        if (limit > 50) {
          limit = 50;
        }

        if (limit < 1) {
          limit = 1;
        }
      } else {
        limit = 30;
      }

      // -page tag
      let page: number;
      let pageTag = tags.filter((x) => x.includes("page:"));
      if (pageTag.length > 0) {
        tags = tags.filter((x) => !x.includes("page:"));
        page = Number(pageTag[0].replace("page:", ""));

        // Check
        if (page > 750) {
          page = 750;
        }

        if (page < 1) {
          page = 1;
        }
      } else {
        // checking for offset property
        if (ctx.update?.inline_query?.offset) {
          page = Number(ctx.update.inline_query.offset);
        }
      }

      const images = await (from === EScrapperAgentType.E621
        ? this.E621Api
        : this.E926Api
      ).fetchManyByTags(tags, limit, { page });

      await ctx.answerInlineQuery(
        images
          .filter((image) => image.url)
          .map((image) => {
            return <InlineQueryResultPhoto>{
              id: v4(),
              type: "photo",
              photo_url: image.url,
              thumb_url: image.url,
              // \n${ image.description != null ? `\n*Description*: ${ image.description.split('').length > 150 ? `${ this._escapeCharacters(image.description.slice(0, 150)) }\n[Full description](https://e621.net/posts/${ image.id })\n` : this._escapeCharacters(image.description) }` : '' }
              caption: `\n*Search criteria*: \`${tags.join(
                ", "
              )}\`\n*Source*: [Site page](https://e621.net/posts/${image.id})`,
              parse_mode: "MarkdownV2",
              reply_markup: new InlineKeyboard().url(
                "About this Bot",
                "https://services.pawcapsu.ml/leggydog"
              ),
            };
          }),
        {
          is_personal: true,
          cache_time: 10,
          next_offset:
            pageTag.length > 0
              ? null
              : String((typeof page == "number" ? page : 1) + 1),
        }
      );
    });
  }
}
