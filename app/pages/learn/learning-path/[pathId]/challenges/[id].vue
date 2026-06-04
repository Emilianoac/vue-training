<script lang="ts" setup>
import useChallengeData from "@/composables/challenge/useChallengeData";
import ChallengeWorkspace from "@/components/challenge/ChallengeWorkspace.vue";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();

const pathId = route.params.pathId as string;
const challengeId = route.params.id as string;
const { challenge, getChallenge } = useChallengeData();
const { markComplete } = useLearningPathProgress();
await getChallenge(challengeId);

function goToLearningPath() {
  router.push("/learn/learning-paths");
}

function markChallengeComplete() {
  markComplete(pathId, "challenge", challengeId);
}

useSeoMeta({
  title: computed(() => challenge.value?.title),
});

watch(
  () => locale.value,
  async () => {
    await getChallenge(challengeId);
  },
);
</script>

<template>
  <ActivityShell
    v-if="challenge"
    :title="challenge.title"
    back-to="/learn/learning-paths"
    content-class="p-4"
  >
    <ChallengeWorkspace
      :challenge="challenge"
      :continue-label="t('challenge.completion.continueLearningPath')"
      @completed="markChallengeComplete"
      @continue="goToLearningPath"
    />
  </ActivityShell>
</template>
