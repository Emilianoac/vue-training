import { gql } from "graphql-request";
import client from "@@/server/utils/graphqlConfig"

import type { ChallengeService } from "./challenge.interface";
import type { Challenge } from "@/types/challenge";

function createChallengeService(): ChallengeService {
  return {
    async fetchChallenge(slug, locale) {
      const query = gql`
        query Challenge($slug: String!, $locale: I18NLocaleCode!) {
          challenges(
            filters: { slug: { eq: $slug } }
            locale: $locale
          ) {
            title
            slug
            level
            category {
              name
              image {
                url
              }
            }
            short_description
            description
            cover {
              url
            }
            images {
              url
            }
            objectives {
              data
            }
            stackblitz {
              challenge
              solution
            }
          }
        }
      `;

      const { challenges } = await client.request(query, { slug, locale });

      if (!challenges || challenges.length === 0) {
        throw new Error (`Quiz with slug "${slug}" not found.`)
      }
      return challenges[0] as Challenge;
    },

    async fetchChallenges(locale: string) {
      const query = gql`
        query Challenges($locale: I18NLocaleCode!) {
          challenges(locale: $locale) {
            title
            slug
            level
            category {
              name
              image {
                url
              }
            }
            short_description
            cover {
              url
            }
          }
        }
      `;

      const { challenges } = await client.request(query, { locale });
      if (!challenges || challenges.length === 0) {
        throw new Error("Challenges not found.")
      }
      return challenges as Challenge[];
    }
  }
}

export const challengeService = createChallengeService();