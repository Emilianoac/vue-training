<script lang="ts" setup>
import useLessonData from "@/composables/lesson/useLessonData";
import LessonReader from "@/components/lesson/reader/LessonReader.vue";

const route = useRoute();
const { locale } = useI18n();
const { lesson, getLesson } = useLessonData();

await getLesson(route.params.id as string);

useSeoMeta({
  title: computed(() => lesson.value?.title),
});

watch(locale, async () => {
  await getLesson(route.params.id as string);
});
</script>

<template>
  <LessonReader v-if="lesson" :lesson="lesson" />
</template>
