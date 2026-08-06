<script setup lang="ts">
import { ref } from "vue";
import { useTaskFilter, type Task } from "./useTaskFilter";

const tasks = ref<Task[]>([
  { id: 1, title: "Revisar la guía de estilos" },
  { id: 2, title: "Corregir navegación móvil" },
  { id: 3, title: "Preparar el lanzamiento" },
  { id: 4, title: "Documentar el componente" },
]);
const query = ref("");

const { filteredTasks } = useTaskFilter(tasks, query);
</script>

<template>
  <!-- Por favor conserva los atributos data-testid: los tests los usan para validar tu solución. -->
  <main class="task-page">
    <header class="page-heading">
      <span class="eyebrow">Espacio de trabajo</span>
      <h1>Tareas del equipo</h1>
      <p>Filtra el tablero sin acoplar el composable a una forma de entrada específica.</p>
    </header>

    <label class="search-field">
      <span>Buscar tareas</span>
      <input v-model="query" data-testid="query-input" type="search" placeholder="Ej. móvil" />
    </label>

    <ul v-if="filteredTasks.length" data-testid="task-list" class="task-list">
      <li v-for="task in filteredTasks" :key="task.id" class="task-item">
        <span class="task-index">{{ String(task.id).padStart(2, "0") }}</span>
        <strong>{{ task.title }}</strong>
      </li>
    </ul>

    <p v-else data-testid="empty-state" class="empty-state">No hay tareas que coincidan.</p>
  </main>
</template>

<style>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
.task-page { display: grid; gap: 1.5rem; width: min(100% - 2rem, 42rem); margin: min(10vh, 4rem) auto; color: var(--foreground); }
.page-heading { display: grid; gap: 0.3rem; }
.page-heading h1, .page-heading p { margin: 0; }
.page-heading p, .empty-state { color: var(--muted-foreground); }
.eyebrow { color: var(--muted-foreground); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.search-field { display: grid; gap: 0.45rem; color: var(--foreground); font-size: 0.875rem; font-weight: 600; }
.search-field input { width: 100%; padding: 0.65rem 0.75rem; color: var(--foreground); font: inherit; background: var(--background); border: 1px solid var(--border); border-radius: 0.375rem; }
.task-list { display: grid; gap: 0.6rem; padding: 0; margin: 0; list-style: none; }
.task-item { display: flex; gap: 0.85rem; align-items: center; padding: 1rem; background: var(--card); border: 1px solid var(--border); border-radius: 0.5rem; }
.task-index { color: var(--muted-foreground); font-family: monospace; font-size: 0.75rem; }
.empty-state { padding: 1.5rem; text-align: center; background: var(--card); border: 1px dashed var(--border); border-radius: 0.5rem; }
</style>
