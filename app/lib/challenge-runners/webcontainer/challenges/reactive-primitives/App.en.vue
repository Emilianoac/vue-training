<script setup lang="ts">
import { computed, ref as vueRef } from "vue";
import {
  effect,
  reactive,
  readonly,
  ref,
  resetReactivity,
  toRef,
  toRefs,
} from "./reactivity-primitives";

const sourceCount = vueRef(0);
const observedCount = vueRef(0);
const reactiveRuns = vueRef(0);
const refValue = vueRef(0);
const refRuns = vueRef(0);
const readonlyBlocked = vueRef<boolean | null>(null);
const linkPreserved = vueRef<boolean | null>(null);

let state = reactive({ count: 0, label: "Total" });
let publicState = readonly(state);
let countLink = toRef(state, "count");
let stateLinks = toRefs(state);

const status = computed(() => {
  const checks = [reactiveRuns.value > 1, refRuns.value > 1, readonlyBlocked.value, linkPreserved.value];
  const passed = checks.filter(Boolean).length;

  if (passed === checks.length) return { badge: "Connected", label: "All four paths responded", state: "connected" };
  if (passed > 0) return { badge: `${passed}/4`, label: "Some primitives already respond", state: "pending" };
  return { badge: "Not tested", label: "Run the checks", state: "idle" };
});

function testReactive() {
  resetReactivity();
  state = reactive({ count: 0, label: "Total" });
  publicState = readonly(state);
  countLink = toRef(state, "count");
  stateLinks = toRefs(state);
  reactiveRuns.value = 0;

  effect(() => {
    observedCount.value = state.count;
    reactiveRuns.value += 1;
  });

  state.count = 1;
  sourceCount.value = state.count;
}

function testRef() {
  const count = ref(0);
  refRuns.value = 0;

  effect(() => {
    refValue.value = count.value;
    refRuns.value += 1;
  });

  count.value = 1;
}

function testReadonly() {
  const before = state.count;
  (publicState as { count: number }).count = before + 10;
  readonlyBlocked.value = state.count === before;
  sourceCount.value = state.count;
}

function testLinks() {
  countLink.value = state.count + 1;
  sourceCount.value = state.count;
  linkPreserved.value = stateLinks.count?.value === state.count;
}
</script>

<template>
  <main class="primitives-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue in Depth</span>
      <h1>Primitives Lab</h1>
      <p>Check how different APIs create paths into the same state.</p>
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
        <pre><code>object    → reactive Proxy → track / trigger
primitive → ref.value      → track / trigger
property  → toRef.value    → object[key]
view      → readonly Proxy → read / blocked write</code></pre>
      </details>

      <div class="primitive-grid">
        <article>
          <span class="section-label">reactive</span>
          <strong>{{ sourceCount }} → {{ observedCount }}</strong>
          <small>{{ reactiveRuns }} runs</small>
          <button type="button" @click="testReactive">Test Proxy</button>
        </article>
        <article>
          <span class="section-label">ref</span>
          <strong>.value = {{ refValue }}</strong>
          <small>{{ refRuns }} runs</small>
          <button type="button" @click="testRef">Test ref</button>
        </article>
        <article>
          <span class="section-label">readonly</span>
          <strong>{{ readonlyBlocked === true ? "Blocked" : "Pending" }}</strong>
          <small>The source should preserve its value</small>
          <button type="button" @click="testReadonly">Attempt write</button>
        </article>
        <article>
          <span class="section-label">toRef / toRefs</span>
          <strong>{{ linkPreserved === true ? "Linked" : "Pending" }}</strong>
          <small>value should delegate to state.count</small>
          <button type="button" @click="testLinks">Test link</button>
        </article>
      </div>

      <p class="guide">
        Complete the editable file and repeat each check. The tests also verify identity, deep
        conversion, repeated assignments, and future keys.
      </p>
    </section>
  </main>
</template>

<style scoped>
.primitives-lab {
  display: grid;
  gap: 1.5rem;
  width: min(100% - 2rem, 50rem);
  margin: min(8vh, 3.5rem) auto;
  color: var(--foreground);
}

.page-heading,
.status-row > div,
.primitive-grid article,
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
.primitive-grid small {
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

.primitive-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.primitive-grid article {
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--preview-control-radius);
}

.primitive-grid strong {
  font-size: 1.15rem;
}

.primitive-grid button {
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

@media (max-width: 38rem) {
  .status-row {
    align-items: flex-start;
  }

  .primitive-grid {
    grid-template-columns: 1fr;
  }

  .primitive-grid button {
    width: 100%;
  }
}
</style>
