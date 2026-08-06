import { createAsyncResourceLoaderChallenge } from "./challenges/async-resource-loader/config";
import { createComputedUserFilterChallenge } from "./challenges/computed-user-filter/config";
import { createDynamicSettingsTabsChallenge } from "./challenges/dynamic-settings-tabs/config";
import { createDynamicUserProfileChallenge } from "./challenges/dynamic-user-profile/config";
import { createFlexibleTaskFilterChallenge } from "./challenges/flexible-task-filter/config";
import { createKeyboardShortcutListenerChallenge } from "./challenges/keyboard-shortcut-listener/config";
import { createLifecycleSessionMonitorChallenge } from "./challenges/lifecycle-session-monitor/config";
import { createPropsEmitsQuantityStepperChallenge } from "./challenges/props-emits-quantity-stepper/config";
import { createProvideInjectThemeChallenge } from "./challenges/provide-inject-theme/config";
import { createRefCounterStateChallenge } from "./challenges/ref-counter-state/config";
import { createSharedCartStoreChallenge } from "./challenges/shared-cart-store/config";
import { createSharedReadingListChallenge } from "./challenges/shared-reading-list/config";
import { createSlotsProfilePanelChallenge } from "./challenges/slots-profile-panel/config";
import { createUserDirectoryComponentsChallenge } from "./challenges/user-directory-components/config";
import { createUseDisclosurePanelChallenge } from "./challenges/use-disclosure-panel/config";
import { createWatchQuestionLogChallenge } from "./challenges/watch-question-log/config";
import type { WebContainerChallenge } from "./types";

const challengeFactories: Record<string, (locale: string) => WebContainerChallenge> = {
  "async-resource-loader": createAsyncResourceLoaderChallenge,
  "computed-user-filter": createComputedUserFilterChallenge,
  "dynamic-settings-tabs": createDynamicSettingsTabsChallenge,
  "dynamic-user-profile": createDynamicUserProfileChallenge,
  "flexible-task-filter": createFlexibleTaskFilterChallenge,
  "keyboard-shortcut-listener": createKeyboardShortcutListenerChallenge,
  "lifecycle-session-monitor": createLifecycleSessionMonitorChallenge,
  "props-emits-quantity-stepper": createPropsEmitsQuantityStepperChallenge,
  "provide-inject-theme": createProvideInjectThemeChallenge,
  "ref-counter-state": createRefCounterStateChallenge,
  "shared-cart-store": createSharedCartStoreChallenge,
  "shared-reading-list": createSharedReadingListChallenge,
  "slots-profile-panel": createSlotsProfilePanelChallenge,
  "user-directory-components": createUserDirectoryComponentsChallenge,
  "use-disclosure-panel": createUseDisclosurePanelChallenge,
  "watch-question-log": createWatchQuestionLogChallenge,
};

export function getWebContainerChallenge(id: string, locale: string) {
  const createChallenge = challengeFactories[id] ?? createRefCounterStateChallenge;

  return createChallenge(locale);
}
