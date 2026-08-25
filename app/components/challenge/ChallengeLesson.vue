<script setup lang="ts">
import type { LessonDocument } from "@/composables/lesson/useLessonData";

withDefaults(
  defineProps<{
    lesson: LessonDocument;
    showTitle?: boolean;
  }>(),
  {
    showTitle: true,
  },
);
</script>

<template>
  <article class="challenge-lesson pb-4">
    <template v-if="showTitle">
      <h2 class="mb-2 text-xl font-bold">{{ lesson.title }}</h2>
      <p v-if="lesson.description" class="mb-6 text-sm text-muted-foreground">
        {{ lesson.description }}
      </p>
    </template>
    <ContentRenderer :value="lesson" />
  </article>
</template>

<style lang="scss" scoped>
.challenge-lesson {
  :deep(h2) {
    width: fit-content;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
    border-bottom: 3px solid var(--primary);
    font-size: 1.1rem;
    font-weight: 600;
  }

  :deep(h3) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    padding-left: 0.4rem;
    border-left: 4px solid var(--primary);
    font-weight: 600;
  }

  :deep(p) {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    line-height: 1.95;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 1rem;
    padding: 1rem 1rem 1rem 2rem;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    background: var(--card);
    font-size: 0.875rem;
  }

  :deep(ul) {
    list-style: disc;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(li + li) {
    margin-top: 0.5rem;
  }

  :deep(hr) {
    margin: 1.5rem 0;
    border-bottom: 1px solid var(--border);
  }
}
</style>
