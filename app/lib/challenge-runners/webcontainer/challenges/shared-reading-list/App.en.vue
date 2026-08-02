<script setup>
import LessonCatalog from "./LessonCatalog.vue";
import ReadingList from "./ReadingList.vue";
</script>

<template>
  <main class="reading-app">
    <header>
      <span class="eyebrow">Library</span>
      <h1>Your learning path</h1>
      <p>Save lessons from the catalog and find them in your list.</p>
    </header>

    <div class="reading-grid">
      <LessonCatalog />
      <ReadingList />
    </div>
  </main>
</template>

<style>
.reading-app {
  display: grid;
  gap: 1.5rem;
  width: min(100% - 2rem, 58rem);
  margin: min(8vh, 4rem) auto;
  color: var(--foreground);
}
.reading-app header {
  display: grid;
  gap: 0.25rem;
}
.reading-app h1,
.reading-app p {
  margin: 0;
}
.reading-app header p,
.reading-app .empty {
  color: var(--muted-foreground);
}
.reading-app .eyebrow {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
.reading-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(15rem, 0.8fr);
  gap: 1rem;
  align-items: start;
}
.reading-panel {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}
.reading-panel h2 {
  margin: 0;
  font-size: 1rem;
}
.lesson-list {
  display: grid;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}
.lesson-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}
.lesson-row span {
  display: grid;
  gap: 0.15rem;
}
.lesson-row small {
  color: var(--muted-foreground);
}
.lesson-row button {
  padding: 0.45rem 0.65rem;
  color: var(--primary-foreground);
  font: inherit;
  font-weight: 600;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 0.375rem;
  cursor: pointer;
}
.lesson-row button:disabled {
  color: var(--muted-foreground);
  background: var(--muted);
  border-color: var(--border);
  cursor: default;
}
.saved-row button {
  color: var(--foreground);
  background: var(--background);
  border-color: var(--border);
}
@media (max-width: 44rem) {
  .reading-grid {
    grid-template-columns: 1fr;
  }
}
</style>
