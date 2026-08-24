<script setup lang="ts">
import { computed, ref } from "vue";
import {
  nextTick,
  queueJob,
  queueWatcher,
  resetScheduler,
  type SchedulerJob,
} from "./scheduler";

const batchPassed = ref(false);
const orderPassed = ref(false);
const phasesPassed = ref(false);
const batchResult = ref("Sin probar");
const orderResult = ref("Sin probar");
const phasesResult = ref("Sin probar");

const status = computed(() => {
  const passed = [batchPassed.value, orderPassed.value, phasesPassed.value].filter(Boolean).length;
  if (passed === 3) return { badge: "Coordinado", label: "El ciclo completo mantiene su orden", state: "connected" };
  if (passed > 0) return { badge: `${passed}/3`, label: "Parte del scheduler ya responde", state: "pending" };
  return { badge: "Sin probar", label: "Ejecuta las comprobaciones", state: "idle" };
});

async function testBatch() {
  await runCheck(async () => {
    resetScheduler();
    let runs = 0;
    const update = (() => { runs += 1; }) as SchedulerJob;

    queueJob(update);
    queueJob(update);
    queueJob(update);
    const beforeTick = runs;
    await nextTick();

    batchPassed.value = beforeTick === 0 && runs === 1;
    batchResult.value = `${beforeTick} antes · ${runs} después`;
  }, batchResult, batchPassed);
}

async function testOrder() {
  await runCheck(async () => {
    resetScheduler();
    const calls: string[] = [];
    const parent = makeJob(() => calls.push("padre"), 1);
    const child = makeJob(() => calls.push("hijo"), 2);
    const pre = makeJob(() => calls.push("pre"));

    queueJob(child);
    queueWatcher(pre, "pre", 2);
    queueJob(parent);
    await nextTick();

    orderPassed.value = calls.join(" → ") === "padre → pre → hijo";
    orderResult.value = calls.join(" → ") || "La cola no se ejecutó";
  }, orderResult, orderPassed);
}

async function testPhases() {
  await runCheck(async () => {
    resetScheduler();
    const calls: string[] = [];
    const update = makeJob(() => calls.push("update"), 1);
    const sync = makeJob(() => calls.push("sync"));
    const post = makeJob(() => calls.push("post"));

    queueJob(update);
    queueWatcher(post, "post", 1);
    queueWatcher(sync, "sync", 1);
    const immediate = calls.join(" → ");
    await nextTick(() => calls.push("tick"));

    phasesPassed.value = immediate === "sync"
      && calls.join(" → ") === "sync → update → post → tick";
    phasesResult.value = calls.join(" → ") || "Las fases no se ejecutaron";
  }, phasesResult, phasesPassed);
}

function makeJob(run: () => void, id?: number) {
  return Object.assign(run, id === undefined ? {} : { id }) as SchedulerJob;
}

async function runCheck(
  run: () => Promise<void>,
  message: { value: string },
  passed: { value: boolean },
) {
  try {
    await run();
  } catch (error) {
    passed.value = false;
    message.value = error instanceof Error ? error.message : "Error inesperado";
  }
}
</script>

<template>
  <main class="scheduler-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue en profundidad</span>
      <h1>Laboratorio del scheduler</h1>
      <p>Comprueba cómo varias invalidaciones se convierten en un ciclo mínimo y ordenado.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Estado de la cola</span>
          <strong>{{ status.label }}</strong>
        </div>
        <span class="status-badge" :class="status.state">{{ status.badge }}</span>
      </div>

      <details class="context-block" open>
        <summary class="section-label">Contexto del flujo</summary>
        <pre><code>trigger → queueJob(job estable)
              ↓ deduplicar
microtask → pre → updates por id → post
              ↓
          resolver nextTick</code></pre>
      </details>

      <div class="mechanism-grid">
        <article>
          <span class="section-label">Batching</span>
          <strong>{{ batchResult }}</strong>
          <small>Tres invalidaciones deben producir un solo job</small>
          <button type="button" @click="testBatch">Probar lote</button>
        </article>
        <article>
          <span class="section-label">Orden</span>
          <strong>{{ orderResult }}</strong>
          <small>El padre precede a pre y al update de su hijo</small>
          <button type="button" @click="testOrder">Ordenar jobs</button>
        </article>
        <article>
          <span class="section-label">Fases</span>
          <strong>{{ phasesResult }}</strong>
          <small>sync responde ahora; post y nextTick esperan su turno</small>
          <button type="button" @click="testPhases">Recorrer fases</button>
        </article>
      </div>

      <p class="guide">Completa scheduler.ts y repite las comprobaciones. Los tests cubren además jobs añadidos durante el flush, deduplicación post y trabajo disposed.</p>
    </section>
  </main>
</template>

<style scoped>
.scheduler-lab { display: grid; gap: 1.5rem; width: min(100% - 2rem, 52rem); margin: min(8vh, 3.5rem) auto; color: var(--foreground); }
.page-heading, .status-row > div, .mechanism-grid article, .context-block { display: grid; gap: 0.35rem; }
.page-heading h1, .page-heading p, .guide { margin: 0; }
.page-heading p, .guide, .section-label, .mechanism-grid small { color: var(--muted-foreground); }
.eyebrow, .section-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.lab-card { display: grid; gap: 1.25rem; padding: 1.25rem; color: var(--card-foreground); background: var(--card); border: 1px solid var(--border); border-radius: var(--preview-card-radius); }
.status-row { display: flex; gap: 0.75rem; align-items: center; justify-content: space-between; }
.status-badge { padding: 0.35rem 0.6rem; color: var(--muted-foreground); font-size: 0.75rem; font-weight: 700; background: var(--muted); border-radius: var(--preview-control-radius); }
.status-badge.connected { color: var(--primary-foreground); background: var(--primary); }
.context-block summary { width: fit-content; cursor: pointer; }
.context-block pre { padding: 1rem; margin: 0; overflow-x: auto; color: var(--foreground); line-height: 1.7; background: var(--background); border: 1px solid var(--border); border-radius: var(--preview-control-radius); }
.mechanism-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
.mechanism-grid article { padding: 1rem; background: var(--background); border: 1px solid var(--border); border-radius: var(--preview-control-radius); }
.mechanism-grid strong { font-size: 1.05rem; }
.mechanism-grid button { width: fit-content; padding: 0.55rem 0.8rem; margin-top: 0.45rem; color: var(--primary-foreground); font: inherit; font-weight: 600; background: var(--primary); border: 1px solid var(--primary); border-radius: var(--preview-control-radius); cursor: pointer; }
.guide { line-height: 1.6; }
@media (max-width: 48rem) { .mechanism-grid { grid-template-columns: 1fr; } }
@media (max-width: 38rem) { .status-row { align-items: flex-start; } .mechanism-grid button { width: 100%; } }
</style>
