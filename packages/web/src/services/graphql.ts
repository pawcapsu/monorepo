import { InMemoryCache, createHttpLink } from "@apollo/client";
import { SvelteApolloClient } from 'svelte-apollo-client';

export const client = SvelteApolloClient({
  uri: 'https://api.pawcapsu.ml:3000/graphql',
  credentials: 'include',
  cache: new InMemoryCache()
});