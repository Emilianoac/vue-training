import { createAsyncResourceLoaderChallenge } from "./challenges/async-resource-loader/config";
import { createComputedUserFilterChallenge } from "./challenges/computed-user-filter/config";
import { createComponentRuntimeChallenge } from "./challenges/component-runtime/config";
import { createDerivedStateObservationChallenge } from "./challenges/derived-state-observation/config";
import { createDynamicSettingsTabsChallenge } from "./challenges/dynamic-settings-tabs/config";
import { createDynamicUserProfileChallenge } from "./challenges/dynamic-user-profile/config";
import { createEffectDependencyTrackingChallenge } from "./challenges/effect-dependency-tracking/config";
import { createFlexibleTaskFilterChallenge } from "./challenges/flexible-task-filter/config";
import { createKeyboardShortcutListenerChallenge } from "./challenges/keyboard-shortcut-listener/config";
import { createLifecycleSessionMonitorChallenge } from "./challenges/lifecycle-session-monitor/config";
import { createPropsEmitsQuantityStepperChallenge } from "./challenges/props-emits-quantity-stepper/config";
import { createProvideInjectThemeChallenge } from "./challenges/provide-inject-theme/config";
import { createReactivePrimitivesChallenge } from "./challenges/reactive-primitives/config";
import { createRefCounterStateChallenge } from "./challenges/ref-counter-state/config";
import { createSharedCartStoreChallenge } from "./challenges/shared-cart-store/config";
import { createSharedReadingListChallenge } from "./challenges/shared-reading-list/config";
import { createSlotsProfilePanelChallenge } from "./challenges/slots-profile-panel/config";
import { createUpdateSchedulingChallenge } from "./challenges/update-scheduling/config";
import { createUserDirectoryComponentsChallenge } from "./challenges/user-directory-components/config";
import { createUseDisclosurePanelChallenge } from "./challenges/use-disclosure-panel/config";
import { createWatchQuestionLogChallenge } from "./challenges/watch-question-log/config";
import type { WebContainerChallenge } from "./types";

const challengeFactories: Record<string, (locale: string) => WebContainerChallenge> = {
  "async-resource-loader": createAsyncResourceLoaderChallenge,
  "computed-user-filter": createComputedUserFilterChallenge,
  "component-runtime": createComponentRuntimeChallenge,
  "derived-state-observation": createDerivedStateObservationChallenge,
  "dynamic-settings-tabs": createDynamicSettingsTabsChallenge,
  "dynamic-user-profile": createDynamicUserProfileChallenge,
  "effect-dependency-tracking": createEffectDependencyTrackingChallenge,
  "flexible-task-filter": createFlexibleTaskFilterChallenge,
  "keyboard-shortcut-listener": createKeyboardShortcutListenerChallenge,
  "lifecycle-session-monitor": createLifecycleSessionMonitorChallenge,
  "props-emits-quantity-stepper": createPropsEmitsQuantityStepperChallenge,
  "provide-inject-theme": createProvideInjectThemeChallenge,
  "reactive-primitives": createReactivePrimitivesChallenge,
  "ref-counter-state": createRefCounterStateChallenge,
  "shared-cart-store": createSharedCartStoreChallenge,
  "shared-reading-list": createSharedReadingListChallenge,
  "slots-profile-panel": createSlotsProfilePanelChallenge,
  "update-scheduling": createUpdateSchedulingChallenge,
  "user-directory-components": createUserDirectoryComponentsChallenge,
  "use-disclosure-panel": createUseDisclosurePanelChallenge,
  "watch-question-log": createWatchQuestionLogChallenge,
};

export function getWebContainerChallenge(id: string, locale: string) {
  const createChallenge = challengeFactories[id] ?? createRefCounterStateChallenge;

  return createChallenge(locale);
}
