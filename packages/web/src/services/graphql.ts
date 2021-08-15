import { InMemoryCache } from '@apollo/client/core/core.cjs.js';
import { SvelteApolloClient } from "svelte-apollo-client";

export const client = SvelteApolloClient({
  uri: 'https://api.pawcapsu.ml:3000/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
});