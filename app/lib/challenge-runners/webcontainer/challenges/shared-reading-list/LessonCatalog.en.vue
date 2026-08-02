<script setup>
import { useReadingList } from "./useReadingList";

const lessons = [
  { id: "reactivity", title: "Reactivity principles", duration: "12 min" },
  { id: "computed", title: "Computed properties", duration: "10 min" },
  { id: "watchers", title: "Watchers", duration: "14 min" },
];

const { savedLessons, saveLesson } = useReadingList();
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <section class="reading-panel">
    <h2>Catalog</h2>
    <ul class="lesson-list">
      <li v-for="lesson in lessons" :key="lesson.id" class="lesson-row">
        <span>
          <strong>{{ lesson.title }}</strong>
          <small>{{ lesson.duration }}</small>
        </span>
        <button
          data-testid="save-lesson"
          type="button"
          :disabled="savedLessons.includes(lesson.id)"
          @click="saveLesson(lesson.id)"
        >
          {{ savedLessons.includes(lesson.id) ? "Saved" : "Save" }}
        </button>
      </li>
    </ul>
  </section>
</template>
