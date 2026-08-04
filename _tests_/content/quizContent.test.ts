import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const quizzesDirectory = fileURLToPath(new URL("../../content", import.meta.url));

function findQuizFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;

    if (entry.isDirectory()) return findQuizFiles(path);

    return entry.isFile() && entry.name.endsWith("-quiz.yml") ? [path] : [];
  });
}

function getCorrectAnswerPositions(source: string, file: string): number[] {
  const positions: number[] = [];
  const answerSections = source.split(/^    answers:\s*$/m).slice(1);

  for (const [questionIndex, section] of answerSections.entries()) {
    const questionAnswers = section.split(/^  - text:/m)[0] ?? "";
    const answers = questionAnswers.split(/^      - id:/m).slice(1);
    const correctPositions = answers.flatMap((answer, answerIndex) =>
      /^        isCorrect: true\s*$/m.test(answer) ? [answerIndex] : [],
    );

    expect(
      answers.length,
      `${file}, question ${questionIndex + 1}, must have four answers`,
    ).toBe(4);
    expect(
      correctPositions,
      `${file}, question ${questionIndex + 1}, must have exactly one correct answer`,
    ).toHaveLength(1);

    positions.push(correctPositions[0]!);
  }

  return positions;
}

function getLongestPositionStreak(positions: number[]): number {
  let longestStreak = 0;
  let currentStreak = 0;
  let previousPosition: number | undefined;

  for (const position of positions) {
    currentStreak = position === previousPosition ? currentStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, currentStreak);
    previousPosition = position;
  }

  return longestStreak;
}

describe("quiz content", () => {
  for (const file of findQuizFiles(quizzesDirectory)) {
    const relativeFile = file.replace(`${quizzesDirectory}/`, "");

    it(`${relativeFile} keeps correct answers distributed`, () => {
      const source = readFileSync(file, "utf8");
      const positions = getCorrectAnswerPositions(source, relativeFile);
      const counts = [0, 1, 2, 3].map(
        (position) => positions.filter((value) => value === position).length,
      );

      expect(positions, `${relativeFile} must contain questions`).not.toHaveLength(0);
      expect(
        getLongestPositionStreak(positions),
        `${relativeFile} repeats the same correct-answer position too many times`,
      ).toBeLessThanOrEqual(3);
      expect(
        Math.max(...counts) - Math.min(...counts),
        `${relativeFile} has an unbalanced correct-answer distribution`,
      ).toBeLessThanOrEqual(2);
    });
  }
});
