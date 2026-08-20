<script setup lang="ts">
import { computed, ref } from "vue";
import { effect, reactive, resetReactivity } from "./reactivity";

const state = reactive({ count: 0 });
const sourceCount = ref(0);
const renderedCount = ref(state.count);
const effectRuns = ref(0);

const subscriptionState = computed(() => {
  if (effectRuns.value === 0) {
    return { badge: "Sin probar", label: "El efecto todavía no se ejecutó", status: "idle" };
  }

  if (effectRuns.value > 1 && renderedCount.value === sourceCount.value) {
    return { badge: "Conectada", label: "La suscripción respondió al cambio", status: "connected" };
  }

  return { badge: "Por comprobar", label: "Cambia state.count para probarla", status: "pending" };
});

function renderCount() {
  renderedCount.value = state.count;
  effectRuns.value += 1;
}

function connectEffect() {
  resetReactivity();
  effectRuns.value = 0;
  effect(renderCount);
}

function increment() {
  sourceCount.value += 1;
  state.count = sourceCount.value;
}
</script>

<template>
  <main class="reactivity-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue en profundidad</span>
      <h1>Grafo de dependencias</h1>
      <p>Observa cómo un efecto conecta el estado de origen con el valor renderizado.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Estado de la suscripción</span>
          <strong>{{ subscriptionState.label }}</strong>
        </div>
        <span class="status-badge" :class="subscriptionState.status">
          <span class="status-dot" />
          {{ subscriptionState.badge }}
        </span>
      </div>

      <details class="context-block" open>
        <summary class="section-label context-summary">Contexto del flujo</summary>
        <pre class="context-code"><code>effect(renderCount)
  → runner establece activeEffect
  → renderCount lee state.count
  → track(target, "count") guarda runner

state.count cambia
  → trigger(target, "count")
  → runner ejecuta renderCount otra vez</code></pre>
      </details>

      <div class="graph-block">
        <span class="section-label">Grafo que debe registrar track()</span>
        <div class="dependency-graph">
          <article class="graph-node">
            <span>Target</span>
            <code>target</code>
          </article>
          <span class="connector" aria-hidden="true">→</span>
          <article class="graph-node">
            <span>Key</span>
            <code>count</code>
          </article>
          <span class="connector" aria-hidden="true">→</span>
          <article class="graph-node">
            <span>Effect</span>
            <code>runner</code>
          </article>
        </div>
      </div>

      <div class="result-block">
        <span class="section-label">Resultado observable</span>
        <div class="result-flow">
          <article class="result-node">
            <span>state.count</span>
            <strong>{{ sourceCount }}</strong>
          </article>
          <span class="connector" aria-hidden="true">→</span>
          <article class="result-node">
            <span>Valor renderizado</span>
            <strong>{{ renderedCount }}</strong>
          </article>
        </div>
        <p class="run-count">
          <span>Ejecuciones de renderCount</span><strong>{{ effectRuns }}</strong>
        </p>
      </div>

      <div class="actions">
        <button class="primary-button" type="button" @click="connectEffect">
          Ejecutar effect()
        </button>
        <button class="secondary-button" type="button" @click="increment">
          Cambiar state.count
        </button>
      </div>

      <p class="guide">
        Ejecuta effect() y luego cambia state.count. Si get llamó a track(), set usará trigger() y
        renderCount volverá a ejecutarse.
      </p>
    </section>
  </main>
</template>

<style scoped>
.reactivity-lab {
  display: grid;
  gap: 1.5rem;
  width: min(100% - 2rem, 46rem);
  margin: min(10vh, 4rem) auto;
  color: var(--foreground);
}

.page-heading {
  display: grid;
  gap: 0.3rem;
}

.page-heading h1,
.page-heading p {
  margin: 0;
}

.page-heading p,
.guide,
.section-label,
.graph-node span,
.result-node span,
.run-count span {
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

.status-row,
.actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.status-row > div {
  display: grid;
  gap: 0.2rem;
}

.status-badge {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0.35rem 0.55rem;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--muted);
  border-radius: var(--preview-control-radius);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--muted-foreground);
  border-radius: 50%;
}

.status-badge.connected {
  color: var(--primary-foreground);
  background: var(--primary);
}

.status-badge.connected .status-dot {
  background: var(--primary-foreground);
}

.context-block,
.graph-block,
.result-block {
  display: grid;
  gap: 0.65rem;
}

.context-code {
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  color: var(--foreground);
  font-size: 0.875rem;
  line-height: 1.7;
  white-space: pre-wrap;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--preview-control-radius);
}

.context-summary {
  width: fit-content;
  cursor: pointer;
}

.dependency-graph {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
}

.result-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
}

.graph-node,
.result-node,
.run-count {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--preview-control-radius);
}

.graph-node code {
  color: var(--foreground);
  font-size: 0.875rem;
  font-weight: 700;
}

.result-node strong {
  font-size: 2rem;
}

.connector {
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.run-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}

.actions {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  padding: 0.6rem 0.9rem;
  font: inherit;
  font-weight: 600;
  border-radius: var(--preview-control-radius);
  cursor: pointer;
}

.primary-button {
  color: var(--primary-foreground);
  background: var(--primary);
  border: 1px solid var(--primary);
}

.secondary-button {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.guide {
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 36rem) {
  .status-row {
    align-items: flex-start;
  }

  .dependency-graph,
  .result-flow {
    grid-template-columns: 1fr;
  }

  .connector {
    transform: rotate(90deg);
    justify-self: center;
  }

  .actions button {
    width: 100%;
  }
}
</style>
