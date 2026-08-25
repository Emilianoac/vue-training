<script lang="ts" setup>
import { CheckIcon } from "lucide-vue-next";
import useLessonData from "@/composables/lesson/useLessonData";
import { useLearningPathProgress } from "@/composables/learning-path/useLearningPathProgress";
import { getLearningPathReturnPath } from "@/composables/learning-path/useLearningPathNavigation";

definePageMeta({
  layout: "activity",
});

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const { lesson, getLesson } = useLessonData();
const { isCompleted, markComplete } = useLearningPathProgress();
const learningPathReturnPath = getLearningPathReturnPath();

const pathId = route.params.pathId as string;
const lessonId = route.params.id as string;

await getLesson(lessonId);

useSeoMeta({
  title: computed(() => lesson.value?.title),
});

watch(locale, async () => {
  await getLesson(lessonId);
});

const done = isCompleted(pathId, "lesson", lessonId);

function handleComplete() {
  markComplete(pathId, "lesson", lessonId);
  router.push(learningPathReturnPath);
}
</script>

<template>
  <ActivityShell v-if="lesson" :title="lesson.title" :back-to="learningPathReturnPath">
    <LessonView :lesson="lesson">
      <template #actions>
        <Button
          class="mt-4 w-full lg:hidden"
          size="lg"
          :variant="done ? 'outline' : 'default'"
          @click="handleComplete"
        >
          {{ done ? t("lesson.completed") : t("lesson.markAsCompleted") }}
        </Button>
      </template>

      <template #aside-actions>
        <Button
          class="w-full"
          size="lg"
          :variant="done ? 'outline' : 'default'"
          @click="handleComplete"
        >
          <CheckIcon v-if="done" />
          {{ done ? t("lesson.completed") : t("lesson.markAsCompleted") }}
        </Button>
      </template>
    </LessonView>
  </ActivityShell>
</template>
