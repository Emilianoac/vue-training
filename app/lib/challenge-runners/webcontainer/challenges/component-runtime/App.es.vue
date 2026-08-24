<script setup lang="ts">
import { computed, ref } from "vue";
import {
  createComponentInstance,
  inject,
  mountComponent,
  onMounted,
  provide,
  resetRuntime,
  setupComponent,
  type ComponentDefinition,
} from "./component-runtime";

const instancePassed = ref(false);
const contextPassed = ref(false);
const eventPassed = ref(false);
const instanceResult = ref("Sin probar");
const contextResult = ref("Sin probar");
const eventResult = ref("Sin probar");

const status = computed(() => {
  const passed = [instancePassed.value, contextPassed.value, eventPassed.value].filter(Boolean).length;
  if (passed === 3) return { badge: "Conectado", label: "La instancia completó todo el recorrido", state: "connected" };
  if (passed > 0) return { badge: `${passed}/3`, label: "Parte del runtime ya responde", state: "pending" };
  return { badge: "Sin probar", label: "Ejecuta las comprobaciones", state: "idle" };
});

function testInstance() {
  runCheck(() => {
    resetRuntime();
    const definition: ComponentDefinition = {
      props: ["title"],
      setup: (props) => ({ heading: String(props.title).toUpperCase() }),
    };
    const instance = createComponentInstance({
      type: definition,
      props: { title: "Runtime", id: "lab" },
      children: { default: () => "Contenido" },
    });
    setupComponent(instance);

    instancePassed.value = instance.props.title === "Runtime"
      && instance.attrs.id === "lab"
      && instance.setupState.heading === "RUNTIME"
      && instance.slots.default?.()[0] === "Contenido";
    instanceResult.value = instancePassed.value ? `Instancia #${instance.uid} preparada` : "Faltan entradas o setupState";
  }, instanceResult, instancePassed);
}

function testContext() {
  runCheck(() => {
    resetRuntime();
    let mounted = false;
    const root = createComponentInstance({
      type: {
        setup() {
          provide("theme", "dark");
          onMounted(() => { mounted = true; });
          return () => ({ type: "root" });
        },
      },
    });
    setupComponent(root);

    let theme: unknown;
    const child = createComponentInstance({
      type: { setup: () => { theme = inject("theme"); } },
    }, root);
    setupComponent(child);
    mountComponent(root);

    contextPassed.value = theme === "dark" && mounted;
    contextResult.value = contextPassed.value ? "inject dark · mounted" : "Contexto o lifecycle incompleto";
  }, contextResult, contextPassed);
}

function testEvent() {
  runCheck(() => {
    resetRuntime();
    let payload = "";
    const instance = createComponentInstance({
      type: { emits: ["save"] },
      props: { onSave: (value: unknown) => { payload = String(value); } },
    });
    instance.emit("save", "perfil");

    eventPassed.value = payload === "perfil";
    eventResult.value = eventPassed.value ? "save → perfil" : "El listener no recibió el evento";
  }, eventResult, eventPassed);
}

function runCheck(run: () => void, message: { value: string }, passed: { value: boolean }) {
  try {
    run();
  } catch (error) {
    passed.value = false;
    message.value = error instanceof Error ? error.message : "Error inesperado";
  }
}
</script>

<template>
  <main class="runtime-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue en profundidad</span>
      <h1>Laboratorio de instancias</h1>
      <p>Comprueba cómo una definición adquiere entradas, contexto y ciclo de vida propios.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Estado del runtime</span>
          <strong>{{ status.label }}</strong>
        </div>
        <span class="status-badge" :class="status.state">{{ status.badge }}</span>
      </div>

      <details class="context-block" open>
        <summary class="section-label">Contexto del flujo</summary>
        <pre><code>definición + VNode
        ↓ createComponentInstance
instancia → props · attrs · slots
        ↓ setup con currentInstance
setupState · emit · provide/inject · hooks
        ↓ mountComponent
subTree + mounted</code></pre>
      </details>

      <div class="mechanism-grid">
        <article>
          <span class="section-label">Instancia</span>
          <strong>{{ instanceResult }}</strong>
          <small>Clasifica entradas y conserva el resultado de setup</small>
          <button type="button" @click="testInstance">Preparar instancia</button>
        </article>
        <article>
          <span class="section-label">Contexto</span>
          <strong>{{ contextResult }}</strong>
          <small>Conecta provide, inject y hooks con la instancia activa</small>
          <button type="button" @click="testContext">Probar contexto</button>
        </article>
        <article>
          <span class="section-label">Evento</span>
          <strong>{{ eventResult }}</strong>
          <small>Resuelve el listener que el padre dejó en el VNode</small>
          <button type="button" @click="testEvent">Emitir save</button>
        </article>
      </div>

      <p class="guide">Completa component-runtime.ts y repite las comprobaciones. Los tests cubren además slots, render retornado, herencia por rama y desmontaje.</p>
    </section>
  </main>
</template>

<style scoped>
.runtime-lab { display: grid; gap: 1.5rem; width: min(100% - 2rem, 52rem); margin: min(8vh, 3.5rem) auto; color: var(--foreground); }
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
