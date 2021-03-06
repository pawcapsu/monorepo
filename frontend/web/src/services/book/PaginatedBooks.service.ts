// Importing modules
import { client } from '$services/graphql';
import { gql } from '@apollo/client/core/core.cjs.js';

// Importing types
import type { IPaginatedBooks, IBook, BookSearchOptions } from '@app/shared';

export class PaginatedBooksClass {
  // get
  get(options?: BookSearchOptions): Promise<Array<IBook>> {
    return new Promise((resolve) => {
      const store = client.query(gql`
        query getBooks($options: BookSearchOptionsInput!) {
          books(options: $options) {
            docs {
              _id
              title
              creator {
                _id
                username
              }
              tags(filters: { limit: 4 }) {
                icon
                title
              }
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
            }
          }
        }
      `, {
        variables: {
          options
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

  // paginate books
  paginate(options?: BookSearchOptions): Promise<IPaginatedBooks> {
    return new Promise((resolve) => {
      const store = client.query(gql`
        query getBooks($options: BookSearchOptionsInput!) {
          books(options: $options) {
            docs {
              _id
              title
              creator {
                _id
                username
              }
              tags(filters: { limit: 4 }) {
                icon
                title
                color
              }
              bookSize
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
            }
          }
        }
      `, {
        variables: {
          options
        },
      });

      store.subscribe((obj) => {
        const data = obj.data as any;
      
        if (data) {
          const response = data.books as IPaginatedBooks;
          resolve(response as IPaginatedBooks);
        };
      });
    });
  };
};

export const PaginatedBooksService = new PaginatedBooksClass();