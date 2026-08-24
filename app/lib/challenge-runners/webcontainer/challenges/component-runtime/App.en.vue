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
const instanceResult = ref("Not tested");
const contextResult = ref("Not tested");
const eventResult = ref("Not tested");

const status = computed(() => {
  const passed = [instancePassed.value, contextPassed.value, eventPassed.value].filter(Boolean).length;
  if (passed === 3) return { badge: "Connected", label: "The instance completed the whole journey", state: "connected" };
  if (passed > 0) return { badge: `${passed}/3`, label: "Part of the runtime is responding", state: "pending" };
  return { badge: "Not tested", label: "Run the checks", state: "idle" };
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
      children: { default: () => "Content" },
    });
    setupComponent(instance);

    instancePassed.value = instance.props.title === "Runtime"
      && instance.attrs.id === "lab"
      && instance.setupState.heading === "RUNTIME"
      && instance.slots.default?.()[0] === "Content";
    instanceResult.value = instancePassed.value ? `Instance #${instance.uid} prepared` : "Inputs or setupState are incomplete";
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
    contextResult.value = contextPassed.value ? "inject dark · mounted" : "Context or lifecycle is incomplete";
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
    instance.emit("save", "profile");

    eventPassed.value = payload === "profile";
    eventResult.value = eventPassed.value ? "save → profile" : "The listener did not receive the event";
  }, eventResult, eventPassed);
}

function runCheck(run: () => void, message: { value: string }, passed: { value: boolean }) {
  try {
    run();
  } catch (error) {
    passed.value = false;
    message.value = error instanceof Error ? error.message : "Unexpected error";
  }
}
</script>

<template>
  <main class="runtime-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue in Depth</span>
      <h1>Instance Laboratory</h1>
      <p>Check how a definition gains its own inputs, context, and lifecycle.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Runtime status</span>
          <strong>{{ status.label }}</strong>
        </div>
        <span class="status-badge" :class="status.state">{{ status.badge }}</span>
      </div>

      <details class="context-block" open>
        <summary class="section-label">Flow context</summary>
        <pre><code>definition + VNode
        ↓ createComponentInstance
instance → props · attrs · slots
        ↓ setup with currentInstance
setupState · emit · provide/inject · hooks
        ↓ mountComponent
subTree + mounted</code></pre>
      </details>

      <div class="mechanism-grid">
        <article>
          <span class="section-label">Instance</span>
          <strong>{{ instanceResult }}</strong>
          <small>Classifies inputs and preserves the setup result</small>
          <button type="button" @click="testInstance">Prepare instance</button>
        </article>
        <article>
          <span class="section-label">Context</span>
          <strong>{{ contextResult }}</strong>
          <small>Connects provide, inject, and hooks to the active instance</small>
          <button type="button" @click="testContext">Test context</button>
        </article>
        <article>
          <span class="section-label">Event</span>
          <strong>{{ eventResult }}</strong>
          <small>Resolves the listener left by the parent on the VNode</small>
          <button type="button" @click="testEvent">Emit save</button>
        </article>
      </div>

      <p class="guide">Complete component-runtime.ts and repeat the checks. The tests also cover slots, returned render functions, branch inheritance, and unmounting.</p>
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
