import type { MaybeRefOrGetter } from "vue";
import type { AnswerRecord } from "@/schemas/quiz.schema";

type QuizResultStar = "full" | "half" | "empty";

export default function useQuizResultsPresentation(
  userHistory: MaybeRefOrGetter<AnswerRecord[]>,
  percentage: MaybeRefOrGetter<number>,
) {
  const { parse } = useMarkdownParser();

  const parsedHistory = computed(() =>
    toValue(userHistory).map((question) => ({
      ...question,
      parsedQuestion: parse(question.question),
      parsedAnswers: question.answers.map((answer) => ({
        ...answer,
        parsedText: parse(answer.text),
      })),
      parsedExplanation: parse(question.explanation),
    })),
  );

  const stars = computed(() => getResultStars(toValue(percentage)));

  return {
    parsedHistory,
    stars,
  };
}

function getResultStars(percentage: number): QuizResultStar[] {
  const maxStars = 3;
  let points = (percentage / 100) * maxStars;

  if (percentage > 0 && points < 0.5) {
    points = 0.5;
  }

  return Array.from({ length: maxStars }, () => {
    if (points >= 1) {
      points -= 1;
      return "full";
    }

    if (points >= 0.5) {
      points -= 0.5;
      return "half";
    }

    return "empty";
  });
}
