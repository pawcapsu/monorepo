// Importing modules
import { client } from '$services/graphql';
import { gql } from '@apollo/client/core/core.cjs.js';

// Importing types
import type { IPaginatedBooks, IBook, BookSearchOptions } from '@app/shared';

export class PaginatedBooksClass {
  // get
  get(options?: BookSearchOptions) {
    return new Promise((resolve) => {
      console.log(options);
      const store = client.query(gql`
        query getBooks($options: BookSearchOptionsInput!) {
          books(options: $options) {
            docs {
              title
              creator {
                _id
                username
              }
              description {
                _id
                type
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
          options: <BookSearchOptions>{
            limit: options.limit ?? 25,
          },
        },
      });

      store.subscribe((obj) => {
        const data = obj.data as any;
      
        if (data) {
          const response = data.books as IPaginatedBooks;
          resolve(response.docs as Array<IBook>);
        };
      });
    });
  };
};

export const PaginatedBooksService = new PaginatedBooksClass();