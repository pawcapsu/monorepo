// Importing modules
import { client } from '$services/graphql';
import { gql } from '@apollo/client/core/core.cjs.js';

// Importing types
import type { IBook } from '@app/shared';

export class BookClass {
  // get
  get(bookId: string): Promise<IBook> {
    return new Promise((resolve) => {
      const store = client.query(gql`
        query getBook($bookId: String!) {
          book(bookId: $bookId) {
            title
            description {
              nodes {
                __typename
                ...on TextNode {
                  type
                  content
                }
                ...on PictureNode {
                  type
                  url
                  caption
                }
              }
            }
            chapters {
              title
              description {
                nodes {
                  __typename
                  ...on TextNode {
                    type
                    content
                  }
                  ...on PictureNode {
                    type
                    url
                    caption
                  }
                }
              }
              content {
                nodes {
                  __typename
                  ...on TextNode {
                    type
                    content
                  }
                  ...on PictureNode {
                    type
                    url
                    caption
                  }
                }
              }
            }
          }
        }
      `, {
        variables: {
          bookId
        },
      });

      store.subscribe((obj) => {
        const data = obj.data as any;
      
        if (data) {
          const response = data.book as IBook;
          resolve(response);
        };
      });
    });
  };
};

export const BookService = new BookClass();