import { UnifiedPost } from "@app/services";
import { Post } from "@app/services/notifier/imported";
import { Injectable, Logger } from "@nestjs/common";
import { SocksProxyAgent } from "socks-proxy-agent";
import { default as axios } from "axios";

@Injectable()
export class ApiService {
  private readonly logger = new Logger("E621ApiService");
  public readonly url = "https://e621.net";
  public readonly headers = {
    headers: {
      "User-Agent": "LeggydogBot/1.0 (@SniperFox213 on github)",
    },
  };

  public async getAxiosClient() {
    // Checking data
    // const agent = new SocksProxyAgent(`socks5://oejfvhuk-rotate:hcm2e0anok5g@p.webshare.io:80`);
    return axios.create();
  };

  // fetchOneByTags
  public async fetchOneByTags(tags: String[]): Promise<UnifiedPost> {
    const client = await this.getAxiosClient();
    const { data } = await client.get(
      `${this.url}/posts.json?tags=${ tags.join("+") }&limit=1`,
      {
        ...this.headers
      }
    );

    const { posts } = data;
    const [unparsedPost] = posts;

    const post: UnifiedPost = {
      id: unparsedPost.id,
      description: unparsedPost.description,
      score: unparsedPost.score.total,
      url: unparsedPost.file.url,
    };

    return post;
  }

  // fetchManyByTags
  public async fetchManyByTags(
    tags: String[],
    numberToFetch = 5,
    options?: {
      page?: number;
    }
  ): Promise<UnifiedPost[]> {
    const client = await this.getAxiosClient();
    const request = await client.get(
      `${this.url}/posts.json?tags=${tags.join("+")}`,
      {
        ...this.headers,
        params: {
          limit: numberToFetch,
          page: options?.page ?? null,
        },
      }
    );

    console.log(request);
    
    const posts: Post[] = request.data.posts;
    const unifiedPosts: Array<UnifiedPost> = [];
    posts.forEach((post) => {
      unifiedPosts.push({
        id: post.id,
        description: post.description,
        score: post.score.total,
        url: post.file.url,
      });
    });

    return unifiedPosts;
  };

  // fetchTag
  public async fetchTag(
    tag: String,
  // +todo add typings
  ): Promise<Array<any>> {
    const client = await this.getAxiosClient();
    const request = await client.get(
      `${this.url}/tags.json?search[name_matches]=${tag}`,
      {
        ...this.headers
      }
    );

    const tags = request.data.tags || request.data;
    return tags ?? [];
  };
}
