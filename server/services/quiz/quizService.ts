
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

      const { quizzes } = await client.request(query, { slug, locale });

      if (!quizzes || quizzes.length === 0) {
        throw new Error (`Quiz with slug "${slug}" not found.`)
      }
      return quizzes[0] as Quiz;
    },

    async fetchQuizzes(locale: string) {
      const query = gql`
        query Quizzes($locale: I18NLocaleCode!) {
          quizzes (locale: $locale) {
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

      const { quizzes } = await client.request(query, { locale });
      if (!quizzes || quizzes.length === 0) {
        throw new Error("Quizzes not found.")
      }
      return quizzes as Quiz[];
    }
  }
}

export const quizService = createQuizService();