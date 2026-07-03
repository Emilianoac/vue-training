import { describe, expect, it } from "vitest";
import {
  emptyTestSummary,
  useVitestReporter,
} from "@/lib/challenge-runners/webcontainer/composables/useVitestReporter";

describe("useVitestReporter", () => {
  const { parseReport } = useVitestReporter();

  it("returns an empty result for an invalid report", () => {
    expect(parseReport(null)).toEqual({
      summary: emptyTestSummary,
      testCases: [],
    });
  });

  it("extracts the test summary and test cases", () => {
    const report = {
      numFailedTests: 1,
      numPassedTests: 2,
      numTotalTests: 3,
      testResults: [
        {
          assertionResults: [
            { fullName: "Counter increments", status: "passed" },
            { title: "Counter resets", status: "failed" },
            {
              ancestorTitles: ["Counter", "initial state"],
              name: "starts at zero",
              status: "pass",
            },
          ],
        },
      ],
    };

    expect(parseReport(report)).toEqual({
      summary: {
        failed: 1,
        passed: 2,
        total: 3,
      },
      testCases: [
        { name: "Counter increments", status: "passed" },
        { name: "Counter resets", status: "failed" },
        { name: "Counter > initial state > starts at zero", status: "passed" },
      ],
    });
  });

  it("ignores malformed test files and assertions", () => {
    const report = {
      testResults: [
        null,
        { assertionResults: null },
        { assertionResults: [null, { status: "passed" }] },
      ],
    };

    expect(parseReport(report).testCases).toEqual([]);
  });

  it("uses zero for missing or invalid summary values", () => {
    expect(
      parseReport({
        numFailedTests: "1",
        numPassedTests: undefined,
        numTotalTests: null,
      }).summary,
    ).toEqual(emptyTestSummary);
  });
});
