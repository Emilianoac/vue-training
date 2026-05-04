<script lang="ts" setup>
import useLessonData from "@/composables/lesson/useLessonData";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
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
  router.push(`/dashboard/learning-path/${pathId}`);
}
</script>

<template>
  <LessonView v-if="lesson" :lesson="lesson as unknown as Record<string, unknown>">
    <template #actions="{ currentSlide, totalSlides }">
      <Button
        v-if="currentSlide === totalSlides || done"
        class="w-full mt-2"
        size="lg"
        :variant="done ? 'outline' : 'default'"
        @click="handleComplete"
      >
        {{ done ? "✓ Completado" : "Marcar como completado" }}
      </Button>
    </template>
  </LessonView>
</template>
