import quizzes from "@/data/quizzes";

export default async function getQuizService(id: string) {
  try {
    const result = quizzes.find(q => q.id === id);
    if (!result) throw new Error("Quiz not found");

    await new Promise(resolve => setTimeout(resolve, 0));

    return result;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An unexpected error occurred");
  }
}
