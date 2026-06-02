<script lang="ts" setup>
import useLessonData from "@/composables/lesson/useLessonData";

const route = useRoute();
const { locale } = useI18n();
const { lesson, getLesson } = useLessonData();

await getLesson(route.params.id as string);

watch(locale, async () => {
  await getLesson(route.params.id as string);
});
</script>

<template>
  <LessonView v-if="lesson" :lesson="(lesson as unknown as Record<string, unknown>)" />
</template>