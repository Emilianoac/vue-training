import { vi } from "vitest";
import sampleQuiz from "../../../__sample-data__/sampleQuiz";


export const getQuizServiceMock = vi.fn(() => Promise.resolve(sampleQuiz));

vi.mock("@/services/api/get-quiz/getQuizService", () => ({
  default: getQuizServiceMock,
}));