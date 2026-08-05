<script setup>
import { ref } from "vue";
import { useKeyboardShortcut } from "./useKeyboardShortcut";

const isOpen = ref(true);

function closePanel() {
  isOpen.value = false;
}

function openPanel() {
  isOpen.value = true;
}

useKeyboardShortcut(closePanel);
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <main class="shortcut-page">
    <div class="page-heading">
      <span class="eyebrow">Preferences</span>
      <h1>Keyboard shortcuts</h1>
      <p>Configure quick actions to navigate the platform.</p>
    </div>

    <button v-if="!isOpen" data-testid="open-panel" class="primary-btn" type="button" @click="openPanel">
      Open settings
    </button>

    <section v-if="isOpen" data-testid="shortcut-panel" class="shortcut-panel" role="dialog" aria-modal="true">
      <div>
        <span class="key">Ctrl + Alt + M</span>
        <h2>Close settings</h2>
        <p>Use the shortcut to return to the main screen.</p>
      </div>
      <button data-testid="close-panel" class="secondary-btn" type="button" @click="closePanel">Close</button>
    </section>
  </main>
</template>

<style>
.shortcut-page { display: grid; gap: 1.5rem; width: min(100% - 2rem, 42rem); margin: min(12vh, 5rem) auto; color: var(--foreground); }
.page-heading { display: grid; gap: 0.25rem; }
.page-heading h1, .page-heading p, .shortcut-panel h2, .shortcut-panel p { margin: 0; }
.page-heading p, .shortcut-panel p { color: var(--muted-foreground); }
.eyebrow { color: var(--muted-foreground); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.shortcut-panel { display: flex; gap: 1rem; align-items: center; justify-content: space-between; padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: 0.5rem; }
.shortcut-panel > div { display: grid; gap: 0.35rem; }
.key { width: fit-content; padding: 0.2rem 0.45rem; color: var(--muted-foreground); font-family: monospace; background: var(--muted); border: 1px solid var(--border); border-radius: 0.25rem; }
.primary-btn, .secondary-btn { width: fit-content; padding: 0.55rem 0.8rem; color: var(--primary-foreground); font: inherit; font-weight: 600; background: var(--primary); border: 1px solid var(--primary); border-radius: 0.375rem; cursor: pointer; }
.secondary-btn { color: var(--foreground); background: var(--background); border-color: var(--border); }
@media (max-width: 32rem) { .shortcut-panel { align-items: start; flex-direction: column; } }
</style>
