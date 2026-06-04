<script lang="ts" setup>
import useLessonData from "@/composables/lesson/useLessonData";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const { lesson, getLesson } = useLessonData();
const { isCompleted, markComplete } = useLearningPathProgress();

const pathId = route.params.pathId as string;
const lessonId = route.params.id as string;

await getLesson(lessonId);

watch(locale, async () => {
  await getLesson(lessonId);
});

const done = isCompleted(pathId, "lesson", lessonId);

function handleComplete() {
  markComplete(pathId, "lesson", lessonId);
  router.push("/learn/learning-paths");
}
</script>

<template>
  <ActivityShell
    v-if="lesson"
    :title="lesson.title as string"
    back-to="/learn/learning-paths"
  >
    <LessonView :lesson="lesson as unknown as Record<string, unknown>">
      <template #actions>
        <Button
          class="mt-4 w-full xl:hidden"
          size="lg"
          :variant="done ? 'outline' : 'default'"
          @click="handleComplete"
        >
          {{ done ? t("lesson.completed") : t("lesson.markAsCompleted") }}
        </Button>
      </template>

      <template #aside-actions>
        <Button
          class="mt-4 w-full"
          size="lg"
          :variant="done ? 'outline' : 'default'"
          @click="handleComplete"
        >
          {{ done ? t("lesson.completed") : t("lesson.markAsCompleted") }}
        </Button>
      </template>
    </LessonView>
  </ActivityShell>
</template>
