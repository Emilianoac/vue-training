import { createComputedUserFilterChallenge } from "./challenges/computed-user-filter/config";
import { createLifecycleSessionMonitorChallenge } from "./challenges/lifecycle-session-monitor/config";
import { createPropsEmitsQuantityStepperChallenge } from "./challenges/props-emits-quantity-stepper/config";
import { createRefCounterStateChallenge } from "./challenges/ref-counter-state/config";
import { createSlotsProfilePanelChallenge } from "./challenges/slots-profile-panel/config";
import { createWatchQuestionLogChallenge } from "./challenges/watch-question-log/config";
import type { WebContainerChallenge } from "./types";

const challengeFactories: Record<string, (locale: string) => WebContainerChallenge> = {
  "computed-user-filter": createComputedUserFilterChallenge,
  "lifecycle-session-monitor": createLifecycleSessionMonitorChallenge,
  "props-emits-quantity-stepper": createPropsEmitsQuantityStepperChallenge,
  "ref-counter-state": createRefCounterStateChallenge,
  "slots-profile-panel": createSlotsProfilePanelChallenge,
  "watch-question-log": createWatchQuestionLogChallenge,
};

export function getWebContainerChallenge(id: string, locale: string) {
  const createChallenge = challengeFactories[id] ?? createRefCounterStateChallenge;

  return createChallenge(locale);
}
