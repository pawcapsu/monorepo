import { InMemoryCache } from '@apollo/client/core/core.cjs.js';
import { SvelteApolloClient } from "svelte-apollo-client";

import { Config } from '$config/index';

// export { gql } from '@apollo/client/core/core.cjs.js';
export const client = SvelteApolloClient({
  uri: `${ Config.get('MODE') === 'PRODUCTION' ? 'https://api.pawcapsu.ml:3000' : 'http://localhost:3001' }/graphql`,
  credentials: 'include',
  cache: new InMemoryCache(),
});