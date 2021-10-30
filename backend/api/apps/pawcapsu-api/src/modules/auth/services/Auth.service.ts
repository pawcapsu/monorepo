import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProfilesService } from "@pawcapsu/modules/profiles/services";
import axios from "axios";
import { request, gql } from "graphql-request";

@Injectable()
export class AuthService {
  constructor(private readonly profilesService: ProfilesService) { }

  // authorizeUser
  async authorizeUser(tokenId: string) {
    const token = await this.fetchToken(tokenId);

    if (token.email == null)
      throw new HttpException("Invalid Payload", HttpStatus.BAD_REQUEST);

    // Getting information about this user
    const email = token.email;

    // Checking if this user exists
    let profile = await this.profilesService.findProfildByEmail(email);
    if (!profile) {
      // Creating new profile
      profile = await this.profilesService.createProfile({ email });
    }

    return profile;
  }

  // fetchToken
  async fetchToken(token: string) {
    const query = gql`
      query FetchToken($token: String!) {
        fetchToken(secret: $token) {
          profile {
            email
          }
        }
      }
    `;

    const response = await request("https://api.cloud.odzi.dog/graphql", query, { token });
    return {
      email: response?.fetchToken?.profile?.email,
    };
  }
}
