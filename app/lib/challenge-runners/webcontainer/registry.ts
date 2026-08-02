import { createComputedUserFilterChallenge } from "./challenges/computed-user-filter/config";
import { createDynamicSettingsTabsChallenge } from "./challenges/dynamic-settings-tabs/config";
import { createLifecycleSessionMonitorChallenge } from "./challenges/lifecycle-session-monitor/config";
import { createPropsEmitsQuantityStepperChallenge } from "./challenges/props-emits-quantity-stepper/config";
import { createProvideInjectThemeChallenge } from "./challenges/provide-inject-theme/config";
import { createRefCounterStateChallenge } from "./challenges/ref-counter-state/config";
import { createSlotsProfilePanelChallenge } from "./challenges/slots-profile-panel/config";
import { createUserDirectoryComponentsChallenge } from "./challenges/user-directory-components/config";
import { createWatchQuestionLogChallenge } from "./challenges/watch-question-log/config";
import type { WebContainerChallenge } from "./types";

const challengeFactories: Record<string, (locale: string) => WebContainerChallenge> = {
  "computed-user-filter": createComputedUserFilterChallenge,
  "dynamic-settings-tabs": createDynamicSettingsTabsChallenge,
  "lifecycle-session-monitor": createLifecycleSessionMonitorChallenge,
  "props-emits-quantity-stepper": createPropsEmitsQuantityStepperChallenge,
  "provide-inject-theme": createProvideInjectThemeChallenge,
  "ref-counter-state": createRefCounterStateChallenge,
  "slots-profile-panel": createSlotsProfilePanelChallenge,
  "user-directory-components": createUserDirectoryComponentsChallenge,
  "watch-question-log": createWatchQuestionLogChallenge,
};

export function getWebContainerChallenge(id: string, locale: string) {
  const createChallenge = challengeFactories[id] ?? createRefCounterStateChallenge;

  return createChallenge(locale);
}
