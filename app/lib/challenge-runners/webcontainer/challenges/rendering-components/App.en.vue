<script setup lang="ts">
import { computed, ref } from "vue";
import { createContainer, snapshot } from "./host";
import { h, render, type ComponentDefinition } from "./renderer";

const mountPassed = ref(false);
const patchPassed = ref(false);
const keyedPassed = ref(false);
const mountResult = ref("Not tested");
const patchResult = ref("Not tested");
const keyedResult = ref("Not tested");

const status = computed(() => {
  const passed = [mountPassed.value, patchPassed.value, keyedPassed.value].filter(Boolean).length;
  if (passed === 3) return { badge: "Synchronized", label: "The VNodes preserve the correct identity", state: "connected" };
  if (passed > 0) return { badge: `${passed}/3`, label: "Part of the renderer is responding", state: "pending" };
  return { badge: "Not tested", label: "Run the checks", state: "idle" };
});

function testMount() {
  runCheck(() => {
    const container = createContainer();
    render(h("section", { id: "lab", key: "root" }, [
      h("h2", null, "Renderer"),
      h("button", { disabled: true }, "Save"),
    ]), container);

    const tree = snapshot(container);
    mountPassed.value = JSON.stringify(tree) === JSON.stringify([{
      type: "section",
      props: { id: "lab" },
      children: [
        { type: "h2", props: {}, children: "Renderer" },
        { type: "button", props: { disabled: true }, children: "Save" },
      ],
    }]);
    mountResult.value = mountPassed.value ? "section → h2 + button" : formatTree(tree);
  }, mountResult, mountPassed);
}

function testPatch() {
  runCheck(() => {
    const container = createContainer();
    render(h("div", { class: "before", title: "remove" }, "One"), container);
    const element = container.children[0];

    render(h("div", { class: "after" }, "Two"), container);
    const tree = snapshot(container);

    patchPassed.value = container.children[0] === element
      && JSON.stringify(tree) === JSON.stringify([{
        type: "div",
        props: { class: "after" },
        children: "Two",
      }]);
    patchResult.value = patchPassed.value ? "same el · props and text updated" : formatTree(tree);
  }, patchResult, patchPassed);
}

function testKeyed() {
  runCheck(() => {
    const container = createContainer();
    const Row: ComponentDefinition = {
      render: (props) => h("li", { "data-id": props.id }, String(props.label)),
    };
    const row = (id: string, label: string) => h(Row, { key: id, id, label });

    render(h("ul", null, [row("a", "A"), row("b", "B"), row("c", "C")]), container);
    const list = container.children[0];
    if (list?.kind !== "element") throw new Error("The list was not mounted");
    const [a, b, c] = list.children;

    render(h("ul", null, [row("c", "C"), row("a", "A"), row("d", "D")]), container);
    const order = list.children.map((node) => node.kind === "element" ? node.props["data-id"] : "text");

    keyedPassed.value = list.children[0] === c
      && list.children[1] === a
      && b?.parent === null
      && order.join(" → ") === "c → a → d";
    keyedResult.value = `${order.join(" → ")} · ${keyedPassed.value ? "identity preserved" : "wrong identity"}`;
  }, keyedResult, keyedPassed);
}

function formatTree(tree: unknown) {
  return JSON.stringify(tree).slice(0, 90);
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
  <main class="renderer-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue in Depth</span>
      <h1>Renderer Laboratory</h1>
      <p>Check how virtual descriptions become a stable host tree.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Tree status</span>
          <strong>{{ status.label }}</strong>
        </div>
        <span class="status-badge" :class="status.state">{{ status.badge }}</span>
      </div>

      <details class="context-block" open>
        <summary class="section-label">Flow context</summary>
        <pre><code>render() → new VNode
                 ↓ patch(old, next)
type + key → mount · update · replace
                 ↓ patchChildren
text · components · keyed list
                 ↓ host operations
updated object tree</code></pre>
      </details>

      <div class="mechanism-grid">
        <article>
          <span class="section-label">Mount</span>
          <strong>{{ mountResult }}</strong>
          <small>Creates props and children without exposing key to the host</small>
          <button type="button" @click="testMount">Mount tree</button>
        </article>
        <article>
          <span class="section-label">Patch</span>
          <strong>{{ patchResult }}</strong>
          <small>Reuses the compatible node and removes stale props</small>
          <button type="button" @click="testPatch">Update VNode</button>
        </article>
        <article>
          <span class="section-label">Keyed diff</span>
          <strong>{{ keyedResult }}</strong>
          <small>Moves matched components and unmounts missing ones</small>
          <button type="button" @click="testKeyed">Reconcile list</button>
        </article>
      </div>

      <p class="guide">Complete renderer.ts and repeat the checks. The tests also cover type/key replacement, child-shape transitions, and root unmounting.</p>
    </section>
  </main>
</template>

<style scoped>
.renderer-lab { display: grid; gap: 1.5rem; width: min(100% - 2rem, 52rem); margin: min(8vh, 3.5rem) auto; color: var(--foreground); }
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
