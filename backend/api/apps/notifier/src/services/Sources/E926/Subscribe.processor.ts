import { BullQueueProcessor } from "@nestjs/bull";
import { Job, DoneCallback } from "bull";
import { EQueueNames } from "apps/notifier/src/types";
import { Post } from "@app/services/notifier/imported";
import { default as axios } from "axios";
import { UnifiedPost } from "@app/services";

export class E926SubscribeProcessor {
  public readonly type = EQueueNames.E621;

  public initialize(): BullQueueProcessor {
    async function fetchLatest(
      tags: String[]
    ): Promise<{ posts: Array<Post> }> {
      const { data } = await axios.get(
        `https://e621.net/posts.json?tags=${tags.join("+")}&limit=1`,
        {
          headers: {
            "User-Agent": "LeggydogBot/1.0 (@SniperFox213 on github)",
          },
        }
      );

      return data;
    }

    return async (job: Job, cb: DoneCallback) => {
      const agent = job.data;

      const { posts } = await fetchLatest(agent.data.tags);
      const [unparsedPost] = posts;

      // Parsing {post} request
      const post: UnifiedPost = {
        id: unparsedPost.id,
        description: unparsedPost.description,
        score: unparsedPost.score.total,
        url: unparsedPost.file.url,
      };

      if (post && agent.lastPostId != String(post.id)) {
        // Notify user
        cb(null, { agent, post });
      } else {
        cb(null, null);
      }
    };
  }
}
