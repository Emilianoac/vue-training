
import type { RandomTip } from "@/types/random-tip";
import { gql } from "graphql-request";
import client from "@@/server/utils/graphqlConfig"

import type { RandomTipService } from "@@/server/services/random-tip/randomTip.interface";

function createRandomTipService(): RandomTipService {
  return {
    async fetchRandomTips(locale: string) {
      const query = gql`
        query RandomTips($locale: I18NLocaleCode!) {
          randomTips (locale: $locale) {
            documentId
            title
            category {
              name
              image {
                url
              }
            }
            short_description
            content
            code_examples {
              code
              lang
            }
            source_url
          }
        }
      `;

      const { randomTips } = await client.request(query, { locale });
      if (!randomTips || randomTips.length === 0) {
        throw new Error("Random tips not found.")
      }
      return randomTips as RandomTip[];
    }
  }
}

export const randomTipService = createRandomTipService();