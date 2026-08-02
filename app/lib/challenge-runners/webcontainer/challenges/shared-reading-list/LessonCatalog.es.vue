<script setup>
import { useReadingList } from "./useReadingList";

const lessons = [
  { id: "reactivity", title: "Principios de reactividad", duration: "12 min" },
  { id: "computed", title: "Propiedades computadas", duration: "10 min" },
  { id: "watchers", title: "Watchers", duration: "14 min" },
];

const { savedLessons, saveLesson } = useReadingList();
</script>

<template>
  <!-- Por favor conserva los atributos data-testid: los tests los usan para validar tu solución. -->
  <section class="reading-panel">
    <h2>Catálogo</h2>
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
          {{ savedLessons.includes(lesson.id) ? "Guardada" : "Guardar" }}
        </button>
      </li>
    </ul>
  </section>
</template>
