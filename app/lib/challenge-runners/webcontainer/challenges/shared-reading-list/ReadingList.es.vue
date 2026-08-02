<script setup>
import { useReadingList } from "./useReadingList";

const lessonNames = {
  reactivity: "Principios de reactividad",
  computed: "Propiedades computadas",
  watchers: "Watchers",
};

const { savedLessons, removeLesson } = useReadingList();
</script>

<template>
  <!-- Por favor conserva los atributos data-testid: los tests los usan para validar tu solución. -->
  <aside class="reading-panel">
    <h2>Lista de lectura · {{ savedLessons.length }}</h2>
    <p v-if="savedLessons.length === 0" data-testid="empty-list" class="empty">
      Aún no has guardado lecciones.
    </p>
    <ul v-else class="lesson-list">
      <li
        v-for="lessonId in savedLessons"
        :key="lessonId"
        data-testid="saved-lesson"
        class="lesson-row saved-row"
      >
        <strong>{{ lessonNames[lessonId] }}</strong>
        <button type="button" @click="removeLesson(lessonId)">Quitar</button>
      </li>
    </ul>
  </aside>
</template>
