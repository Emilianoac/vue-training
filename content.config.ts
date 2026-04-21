import { defineContentConfig, defineCollection } from "@nuxt/content";
import { quizSchema } from "./app/schemas/quiz.schema";
import { challengeSchema } from "./app/schemas/challenge.schema";
import { tipSchema } from "./app/schemas/tip.schema";

export default defineContentConfig({
  collections: {
    // Quizzes
    quizzes_en: defineCollection({
      type: "data",
      source: {
        include: "en/quizzes/**",
        prefix: "",
      },
      schema: quizSchema,
    }),

    quizzes_es: defineCollection({
      type: "data",
      source: {
        include: "es/quizzes/**",
        prefix: "",
      },
      schema: quizSchema,
    }),

    // Challenges
    challenges_en: defineCollection({
      type: "data",
      source: {
        include: "en/challenges/**",
        prefix: "",
      },
      schema: challengeSchema,
    }),

    challenges_es: defineCollection({
      type: "data",
      source: {
        include: "es/challenges/**",
        prefix: "",
      },
      schema: challengeSchema,
    }),

    // Tips
    tips_en: defineCollection({
      type: "page",
      source: {
        include: "en/tips/**",
        prefix: "",
      },
      schema: tipSchema,
    }),

    tips_es: defineCollection({
      type: "page",
      source: {
        include: "es/tips/**",
        prefix: "",
      },
      schema: tipSchema,
    }),
  },
});
