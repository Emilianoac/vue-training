<script setup lang="ts">
import { computed as vueComputed, ref as vueRef } from "vue";
import { ref } from "./reactivity-core";
import {
  computed,
  resetObservation,
  watch,
  watchEffect,
} from "./observation";

const computedResult = vueRef("Not tested");
const computedPassed = vueRef(false);
const watchResult = vueRef("Not tested");
const watchPassed = vueRef(false);
const effectResult = vueRef("Not tested");
const effectPassed = vueRef(false);

const status = vueComputed(() => {
  const passed = [computedPassed.value, watchPassed.value, effectPassed.value].filter(Boolean).length;

  if (passed === 3) return { badge: "Connected", label: "All three mechanisms responded", state: "connected" };
  if (passed > 0) return { badge: `${passed}/3`, label: "Part of the model already responds", state: "pending" };
  return { badge: "Not tested", label: "Run the checks", state: "idle" };
});

function testComputed() {
  resetObservation();
  const source = ref(2);
  let getterRuns = 0;
  const doubled = computed(() => {
    getterRuns += 1;
    return source.value * 2;
  });

  const first = doubled.value;
  const second = doubled.value;
  source.value = 3;
  const runsBeforeRead = getterRuns;
  const third = doubled.value;

  computedPassed.value = first === 4
    && second === 4
    && third === 6
    && runsBeforeRead === 1
    && getterRuns === 2;
  computedResult.value = `${first}, ${second} → ${third} · ${getterRuns} calculations`;
}

function testWatch() {
  resetObservation();
  const source = ref(0);
  const transitions: string[] = [];
  const stop = watch(source, (newValue, oldValue) => {
    transitions.push(`${oldValue} → ${newValue}`);
  });

  source.value = 1;
  stop();

  watchPassed.value = transitions.length === 1 && transitions[0] === "0 → 1";
  watchResult.value = transitions[0] ?? "The callback did not run";
}

function testWatchEffect() {
  resetObservation();
  const source = ref(0);
  let effectRuns = 0;
  let cleanupRuns = 0;
  const stop = watchEffect((onCleanup) => {
    void source.value;
    effectRuns += 1;
    onCleanup(() => {
      cleanupRuns += 1;
    });
  });

  source.value = 1;
  stop();

  effectPassed.value = effectRuns === 2 && cleanupRuns === 2;
  effectResult.value = `${effectRuns} effects · ${cleanupRuns} cleanups`;
}
</script>

<template>
  <main class="observation-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue in Depth</span>
      <h1>Observation Lab</h1>
      <p>Check how one invalidation produces caching, comparison, or repetition with cleanup.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Model status</span>
          <strong>{{ status.label }}</strong>
        </div>
        <span class="status-badge" :class="status.state">{{ status.badge }}</span>
      </div>

      <details class="context-block" open>
        <summary class="section-label">Flow context</summary>
        <pre><code>computed    → invalidate cache → read → recompute once
watch       → run source → compare → clean up → callback
watchEffect → clean up → run fn → track its reads</code></pre>
      </details>

      <div class="mechanism-grid">
        <article>
          <span class="section-label">computed</span>
          <strong>{{ computedResult }}</strong>
          <small>Two reads should share the cache</small>
          <button type="button" @click="testComputed">Test cache</button>
        </article>
        <article>
          <span class="section-label">watch</span>
          <strong>{{ watchResult }}</strong>
          <small>The callback should receive oldValue and newValue</small>
          <button type="button" @click="testWatch">Test source</button>
        </article>
        <article>
          <span class="section-label">watchEffect</span>
          <strong>{{ effectResult }}</strong>
          <small>Cleanup should precede repetition and stop</small>
          <button type="button" @click="testWatchEffect">Test cleanup</button>
        </article>
      </div>

      <p class="guide">
        Complete observation.ts and repeat the checks. The tests also cover computed consumers,
        immediate, reads unrelated to the source, and release on stop.
      </p>
    </section>
  </main>
</template>

<style scoped>
.observation-lab {
  display: grid;
  gap: 1.5rem;
  width: min(100% - 2rem, 52rem);
  margin: min(8vh, 3.5rem) auto;
  color: var(--foreground);
}

.page-heading,
.status-row > div,
.mechanism-grid article,
.context-block {
  display: grid;
  gap: 0.35rem;
}

.page-heading h1,
.page-heading p,
.guide {
  margin: 0;
}

.page-heading p,
.guide,
.section-label,
.mechanism-grid small {
  color: var(--muted-foreground);
}

.eyebrow,
.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.lab-card {
  display: grid;
  gap: 1.25rem;
  padding: 1.25rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--preview-card-radius);
}

.status-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.status-badge {
  padding: 0.35rem 0.6rem;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--muted);
  border-radius: var(--preview-control-radius);
}

.status-badge.connected {
  color: var(--primary-foreground);
  background: var(--primary);
}

.context-block summary {
  width: fit-content;
  cursor: pointer;
}

.context-block pre {
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  color: var(--foreground);
  line-height: 1.7;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--preview-control-radius);
}

.mechanism-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.mechanism-grid article {
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--preview-control-radius);
}

.mechanism-grid strong {
  font-size: 1.05rem;
}

.mechanism-grid button {
  width: fit-content;
  padding: 0.55rem 0.8rem;
  margin-top: 0.45rem;
  color: var(--primary-foreground);
  font: inherit;
  font-weight: 600;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: var(--preview-control-radius);
  cursor: pointer;
}

.guide {
  line-height: 1.6;
}

@media (max-width: 48rem) {
  .mechanism-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 38rem) {
  .status-row {
    align-items: flex-start;
  }

  .mechanism-grid button {
    width: 100%;
  }
}
</style>
