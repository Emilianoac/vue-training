import { defineContentConfig, defineCollection } from "@nuxt/content";
import { quizSchema } from "./app/schemas/quiz.schema";
import { challengeSchema } from "./app/schemas/challenge.schema";
import { randomTipSchema } from "./app/schemas/randomTip.schema";

export default defineContentConfig({
  collections: {   
    // Quizzes
    quizzes_en: defineCollection({
      type: "data",
      source: {
        include: "en/quizzes/**",
        prefix: "",
      },
      schema: quizSchema
    }),

    quizzes_es: defineCollection({
      type: "data",
      source: {
        include: "es/quizzes/**",
        prefix: "",
      },
      schema: quizSchema
    }),

    // Challenges
    challenges_en: defineCollection({
      type: "data",
      source: {
        include: "en/challenges/**",
        prefix: "",
      },
      schema: challengeSchema
    }),

    challenges_es: defineCollection({
      type: "data",
      source: {
        include: "es/challenges/**",
        prefix: "",
      },
      schema: challengeSchema
    }),

    // Random Tips
    randomTips_en: defineCollection({
      type: "data",
      source: {
        include: "en/random-tips/**",
        prefix: "",
      },
      schema: randomTipSchema
    }),

    randomTips_es: defineCollection({
      type: "data",
      source: {
        include: "es/random-tips/**",
        prefix: "",
      },
      schema: randomTipSchema
    })
  }
})