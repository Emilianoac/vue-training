
import type { Quiz } from "@/types/quiz";
import { gql } from "graphql-request";
import client from "@@/server/utils/graphqlConfig"

import type { QuizService } from "@@/server/services/quiz/quizService.interface";

function createQuizService(): QuizService {
  return {
    async fetchQuiz(slug: string, locale: string) {
      const query = gql`
        query QuizBySlug($slug: String!, $locale: I18NLocaleCode!) {
          quizzes(
            filters: { slug: { eq: $slug } }
            locale: $locale
          ) {
            documentId
            title
            level
            description
            category {
              name
              image {
                url
              }
            }
            questions {
              questionText
              correctAnswerExplanation
              correctAnswerCodeExample {
                code
                language
              }
              answers {
                id
                isCorrect
                answerText
              }
            }
          }
        }
      `;

      try {
        const { quizzes } = await client.request(query, { slug, locale });

        if (!quizzes || quizzes.length === 0) {
          throw createError({
            statusCode: 404,
            statusMessage: `Quiz with slug "${slug}" not found`,
          });
        }

        return quizzes[0] as Quiz;

      } catch (e: unknown) {
        console.error("Error fetching quiz");

        throw createError({
          statusCode: 500,
          statusMessage: e instanceof Error ? e.message : "Internal server error",
        });
      }
    },

    async fetchQuizzes() {
      const query = gql`
        query {
          quizzes {
            documentId
            title
            slug
            level
            description
            category {
              name
              image { 
                url 
              }
            }
          }
        }
      `;

      try {
        const { quizzes } = await client.request(query);

        if (!quizzes || quizzes.length === 0) {
          throw createError({
            statusCode: 404,
            statusMessage: "Quizzes not found"
          });
        }

        return quizzes as Quiz[];

      } catch (e: unknown) {
        console.error("Error fetching quizzes:", e);
        throw createError({
          statusCode: 500,
          statusMessage: e instanceof Error ? e.message : "Internal server error",
        });
      }
    }
  }
}

export const quizService = createQuizService();