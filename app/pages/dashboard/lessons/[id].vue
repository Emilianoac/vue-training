<script lang="ts" setup>
import useLessonData from "@/composables/lesson/useLessonData";
import { Card, CardContent } from "@/components/ui/card";

const route = useRoute();
const { locale } = useI18n();
const { lesson, getLesson } = useLessonData();

await getLesson(route.params.id as string);

watch(locale, async () => {
  await getLesson(route.params.id as string);
});
</script>

<template>
  <div v-if="lesson" class="max-w-[800px] mx-auto">
    <h1 class="text-2xl font-bold mb-4">{{ lesson.title }}</h1>
    <p>{{ lesson.description }}</p>
    <Card>
      <CardContent>
        <ContentRenderer :value="lesson" />
      </CardContent>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
:deep(h1) {
  font-weight: bold;
  font-size: 1.8rem;
}

:deep(h2) {
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

:deep(h3) {
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;

  & :last-of-type {
    margin-bottom: 0;
  }
}

:deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;

  li {
    margin-bottom: 0.5rem;
  }

  & :last-of-type {
    margin-bottom: 0;
  }
}

:deep(hr) {
  margin: 2rem 0;
  border-bottom: 1px solid var(--border);
}

@media (max-width: 600px) {
  :deep(h1) {
    font-size: 1.5rem;
  }

  :deep(h2) {
    font-size: 1.2rem;
  }

  :deep(h3) {
    font-size: 1rem;
  }
}
</style>
