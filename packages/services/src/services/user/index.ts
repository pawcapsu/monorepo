import { client } from '$services/graphql';
import type { FetchResult } from '@apollo/client';
import { gql } from '@apollo/client/core/core.cjs.js';

export class UserServiceClass {
  // loginUser
  async loginUser(token: string): Promise<FetchResult> {
    const login = await client.mutate(gql`
        mutation {
          login(token: "${token}") {
            _id
            email
            username
          }
        }
    `);

    return login;
  };
};

export const UserService = new UserServiceClass();