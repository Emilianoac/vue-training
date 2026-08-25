<script setup lang="ts">
import type { Challenge } from "@/schemas/challenge.schema";
import ChallengeDescription from "@/components/challenge/ChallengeDescription.vue";
import ChallengeLesson from "@/components/challenge/ChallengeLesson.vue";
import useLessonData from "@/composables/lesson/useLessonData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const props = defineProps<{
  challenge: Challenge;
}>();

const { locale, t } = useI18n();
const { lesson, isLoading, error, getLessonForChallenge } = useLessonData();

watch(
  [() => props.challenge.documentId, () => locale.value],
  async ([challengeId]) => {
    await getLessonForChallenge(challengeId);
  },
  { immediate: true },
);
</script>

<template>
  <Tabs default-value="instructions" class="h-full min-h-0 gap-3">
    <TabsList class="grid w-full shrink-0 grid-cols-2 bg-card">
      <TabsTrigger value="instructions">{{ t("challenge.sidebar.instructions") }}</TabsTrigger>
      <TabsTrigger value="lesson">{{ t("challenge.sidebar.lesson") }}</TabsTrigger>
    </TabsList>

    <TabsContent value="instructions" class="min-h-0 overflow-hidden">
      <ScrollArea class="h-full pr-4" type="auto">
        <ChallengeDescription :challenge="props.challenge" :show-title="false" />
      </ScrollArea>
    </TabsContent>

    <TabsContent value="lesson" class="min-h-0 overflow-hidden">
      <ScrollArea class="h-full pr-4" type="auto">
        <div v-if="isLoading" class="space-y-3 py-1">
          <Skeleton class="h-7 w-3/4" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-5/6" />
          <Skeleton class="mt-6 h-32 w-full" />
        </div>
        <p
          v-else-if="error.status"
          class="rounded-md border bg-card p-4 text-sm text-muted-foreground"
        >
          {{ t("challenge.sidebar.lessonUnavailable") }}
        </p>
        <ChallengeLesson v-else-if="lesson" :lesson="lesson" :show-title="false" />
      </ScrollArea>
    </TabsContent>
  </Tabs>
</template>
