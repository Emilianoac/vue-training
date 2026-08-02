<script setup>
import { useReadingList } from "./useReadingList";

const lessonNames = {
  reactivity: "Reactivity principles",
  computed: "Computed properties",
  watchers: "Watchers",
};

const { savedLessons, removeLesson } = useReadingList();
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <aside class="reading-panel">
    <h2>Reading list · {{ savedLessons.length }}</h2>
    <p v-if="savedLessons.length === 0" data-testid="empty-list" class="empty">
      You have not saved any lessons yet.
    </p>
    <ul v-else class="lesson-list">
      <li
        v-for="lessonId in savedLessons"
        :key="lessonId"
        data-testid="saved-lesson"
        class="lesson-row saved-row"
      >
        <strong>{{ lessonNames[lessonId] }}</strong>
        <button type="button" @click="removeLesson(lessonId)">Remove</button>
      </li>
    </ul>
  </aside>
</template>
