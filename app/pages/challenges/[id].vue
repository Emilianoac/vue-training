<script lang="ts" setup>
import ChallengeWorkspace from "@/components/challenge/ChallengeWorkspace.vue";
import useChallengeData from "@/composables/challenge/useChallengeData";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const { locale } = useI18n();

const { challenge, getChallenge } = useChallengeData();
await getChallenge(route.params.id as string);

useSeoMeta({
  title: computed(() => challenge.value?.title),
});

watch(
  () => locale.value,
  async () => {
    await getChallenge(route.params.id as string);
  },
);
</script>

<template>
  <ChallengeWorkspace v-if="challenge" :challenge="challenge" />
</template>

<style lang="postcss" scoped></style>
