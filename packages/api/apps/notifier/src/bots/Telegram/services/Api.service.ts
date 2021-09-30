import { UnifiedPost } from '@app/services';
import { Post } from '@app/services/notifier/imported';
import { Injectable } from '@nestjs/common';
import { default as axios } from 'axios';

@Injectable()
export class ApiService {
  public async fetchOneByTags(tags: String[]): Promise<UnifiedPost> {
    const { data } = await axios.get(`https://e621.net/posts.json?tags=${ tags.join('+') }&limit=1`, {
      headers: {
        'User-Agent': 'LeggydogBot/1.0 (@SniperFox213 on github)'
      }
    });

    const { posts } = data;
    const [unparsedPost] = posts;

    const post: UnifiedPost = {
      id: unparsedPost.id,
      description: unparsedPost.description,
      score: unparsedPost.score.total,
      url: unparsedPost.file.url,
    };

    return post;
  };

  public async fetchManyByTags(tags: String[], numberToFetch = 5, options?: {
    page?: number,
  }): Promise<UnifiedPost[]> {
    const { data } = await axios.get(`https://e621.net/posts.json`, {
      headers: {
        'User-Agent': 'LeggydogBot/1.0 (@SniperFox213 on github)'
      },
      params: {
        tags: tags.join('+'),
        limit: numberToFetch,
        page: options?.page ?? null,
      }
    });

    const posts: Post[] = data.posts;
    const unifiedPosts: Array<UnifiedPost> = [];
    posts.forEach(post => {
      unifiedPosts.push({
        id: post.id,
        description: post.description,
        score: post.score.total,
        url: post.file.url,
      });
    });

    return unifiedPosts;
  };
};