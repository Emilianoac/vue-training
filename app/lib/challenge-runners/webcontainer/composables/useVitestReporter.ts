import type { TestCaseResult, TestSummary } from "../types";

export const emptyTestSummary: TestSummary = {
  failed: 0,
  passed: 0,
  total: 0,
};

export function useVitestReporter() {
  function parseReport(report: unknown) {
    return {
      summary: parseVitestSummary(report),
      testCases: parseVitestTestCases(report),
    };
  }

  function parseVitestSummary(report: unknown): TestSummary {
    if (!isObject(report)) return emptyTestSummary;

    const suiteFailures = countSuiteFailures(report);

    return {
      failed: readNumber(report, "numFailedTests") + suiteFailures,
      passed: readNumber(report, "numPassedTests"),
      total: readNumber(report, "numTotalTests") + suiteFailures,
    };
  }

  function parseVitestTestCases(report: unknown): TestCaseResult[] {
    if (!isObject(report)) return [];

    const testResults = Array.isArray(report.testResults) ? report.testResults : [];

    return testResults.flatMap((testFile) => {
      if (!isObject(testFile)) return [];

      const assertionResults = Array.isArray(testFile.assertionResults)
        ? testFile.assertionResults
        : [];

      if (assertionResults.length === 0 && isFailedStatus(testFile.status)) {
        return [
          {
            name: readSuiteName(testFile),
            status: "failed",
          },
        ];
      }

      return assertionResults.flatMap((assertion) => {
        if (!isObject(assertion)) return [];

        const name = readTestName(assertion);
        if (!name) return [];

        return [
          {
            name,
            status: readTestStatus(assertion),
          },
        ];
      });
    });
  }

  return { parseReport };
}

function countSuiteFailures(report: Record<string, unknown>) {
  if (!Array.isArray(report.testResults)) return 0;

  return report.testResults.filter(
    (testFile) =>
      isObject(testFile) &&
      isFailedStatus(testFile.status) &&
      (!Array.isArray(testFile.assertionResults) || testFile.assertionResults.length === 0),
  ).length;
}

function readSuiteName(testFile: Record<string, unknown>) {
  const name = typeof testFile.name === "string" ? testFile.name : "Test suite";
  return name.split(/[\\/]/).at(-1) || name;
}

function readTestName(assertion: Record<string, unknown>) {
  if (typeof assertion.fullName === "string") return assertion.fullName;
  if (typeof assertion.title === "string") return assertion.title;

  const ancestorTitles = Array.isArray(assertion.ancestorTitles)
    ? assertion.ancestorTitles.filter((title): title is string => typeof title === "string")
    : [];

  if (ancestorTitles.length && typeof assertion.name === "string") {
    return [...ancestorTitles, assertion.name].join(" > ");
  }

  return typeof assertion.name === "string" ? assertion.name : "";
}

function readTestStatus(assertion: Record<string, unknown>): TestCaseResult["status"] {
  return isFailedStatus(assertion.status) ? "failed" : "passed";
}

function isFailedStatus(status: unknown) {
  return status === "failed" || status === "fail";
}

function readNumber(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === "number" ? value : 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
