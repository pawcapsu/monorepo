// Importing modules
import { client } from '$services/graphql';
import { gql } from '@apollo/client/core/core.cjs.js';

// Importing types
import type { ExploreBadgesSearchOptions, IExploreBadge, IPaginatedExploreBadges } from '@app/shared';

export class ExploreVariants {
  // get
  get(options?: ExploreBadgesSearchOptions): Promise<Array<IExploreBadge>> {
    return new Promise((resolve) => {
      const store = client.query(gql`
        query getExploreBadges($options: ExploreBadgesSearchOptionsInput!) {
          getExploreBadges(options: $options) {
            docs {
              _id
              title
              color
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
          const response = data.getExploreBadges as IPaginatedExploreBadges;
          resolve(response.docs as Array<IExploreBadge>);
        };
      });
    });
  };  
};

export const ExploreVariantsService = new ExploreVariants();