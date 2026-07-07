import { createComputedUserFilterChallenge } from "./challenges/computed-user-filter/config";
import { createRefCounterStateChallenge } from "./challenges/ref-counter-state/config";
import { createWatchQuestionLogChallenge } from "./challenges/watch-question-log/config";
import type { WebContainerChallenge } from "./types";

const challengeFactories: Record<string, (locale: string) => WebContainerChallenge> = {
  "computed-user-filter": createComputedUserFilterChallenge,
  "ref-counter-state": createRefCounterStateChallenge,
  "watch-question-log": createWatchQuestionLogChallenge,
};

export function getWebContainerChallenge(id: string, locale: string) {
  const createChallenge = challengeFactories[id] ?? createRefCounterStateChallenge;

  return createChallenge(locale);
}
