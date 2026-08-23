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

  if (passed === checks.length) return { badge: "Conectadas", label: "Las cuatro rutas respondieron", state: "connected" };
  if (passed > 0) return { badge: `${passed}/4`, label: "Algunas primitivas ya responden", state: "pending" };
  return { badge: "Sin probar", label: "Ejecuta las comprobaciones", state: "idle" };
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
      <span class="eyebrow">Vue en profundidad</span>
      <h1>Laboratorio de primitivas</h1>
      <p>Comprueba cómo diferentes APIs crean rutas hacia el mismo estado.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Estado del modelo</span>
          <strong>{{ status.label }}</strong>
        </div>
        <span class="status-badge" :class="status.state">{{ status.badge }}</span>
      </div>

      <details class="context-block" open>
        <summary class="section-label">Contexto del flujo</summary>
        <pre><code>objeto    → reactive Proxy → track / trigger
primitivo → ref.value      → track / trigger
propiedad → toRef.value    → object[key]
vista     → readonly Proxy → lectura / escritura bloqueada</code></pre>
      </details>

      <div class="primitive-grid">
        <article>
          <span class="section-label">reactive</span>
          <strong>{{ sourceCount }} → {{ observedCount }}</strong>
          <small>{{ reactiveRuns }} ejecuciones</small>
          <button type="button" @click="testReactive">Probar Proxy</button>
        </article>
        <article>
          <span class="section-label">ref</span>
          <strong>.value = {{ refValue }}</strong>
          <small>{{ refRuns }} ejecuciones</small>
          <button type="button" @click="testRef">Probar ref</button>
        </article>
        <article>
          <span class="section-label">readonly</span>
          <strong>{{ readonlyBlocked === true ? "Bloqueada" : "Pendiente" }}</strong>
          <small>La fuente debe conservar su valor</small>
          <button type="button" @click="testReadonly">Intentar escritura</button>
        </article>
        <article>
          <span class="section-label">toRef / toRefs</span>
          <strong>{{ linkPreserved === true ? "Enlazadas" : "Pendiente" }}</strong>
          <small>value debe delegar a state.count</small>
          <button type="button" @click="testLinks">Probar enlace</button>
        </article>
      </div>

      <p class="guide">
        Completa el archivo editable y repite cada comprobación. Los tests verifican además identidad,
        conversión profunda, asignaciones repetidas y claves futuras.
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
