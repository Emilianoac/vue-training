<script setup lang="ts">
import { computed, ref } from "vue";
import { compile } from "./compiler";

const samples = [
  { label: "Interpolation", template: "<h1>Hello {{ user.name }}</h1>" },
  { label: "Nested tree", template: "<section><h2>{{ title }}</h2><p>Ready</p></section>" },
  { label: "Multiple roots", template: "<h1>{{ title }}</h1><p>Ready</p>" },
];
const source = ref(samples[0]!.template);
const ast = ref("Not compiled");
const code = ref("Not compiled");
const error = ref("");
const status = computed(() => error.value
  ? { badge: "Error", label: error.value, state: "failed" }
  : code.value === "Not compiled"
    ? { badge: "Waiting", label: "Choose a sample and run the compiler", state: "idle" }
    : { badge: "Generated", label: "The three stages produced render code", state: "connected" });

function runCompiler() {
  try {
    const result = compile(source.value);
    ast.value = JSON.stringify(result.ast, null, 2);
    code.value = result.code;
    error.value = "";
  } catch (reason) {
    ast.value = "Compilation stopped";
    code.value = "No render function generated";
    error.value = reason instanceof Error ? reason.message : "Unexpected compiler error";
  }
}

function selectSample(template: string) {
  source.value = template;
  runCompiler();
}
</script>

<template>
  <main class="compiler-lab">
    <header class="page-heading">
      <span class="eyebrow">Vue in Depth</span>
      <h1>Template Compiler Laboratory</h1>
      <p>Observe how source syntax becomes an AST and then a render function.</p>
    </header>

    <section class="lab-card">
      <div class="status-row">
        <div>
          <span class="section-label">Pipeline status</span>
          <strong>{{ status.label }}</strong>
        </div>
        <span class="status-badge" :class="status.state">{{ status.badge }}</span>
      </div>

      <details class="context-block" open>
        <summary class="section-label">Compiler pseudocode</summary>
        <pre><code>compile(template)
  ├─ parse source → Root AST
  ├─ transform nodes → codegenNode
  └─ generate root → render(_ctx, h)

Element       → h(tag, null, children)
Text          → "literal"
Interpolation → String(_ctx.expression)</code></pre>
      </details>

      <div class="sample-row" aria-label="Template samples">
        <button v-for="sample in samples" :key="sample.label" type="button" @click="selectSample(sample.template)">{{ sample.label }}</button>
      </div>

      <label class="source-panel">
        <span class="section-label">1 · Template source</span>
        <textarea v-model="source" rows="4" spellcheck="false" />
      </label>
      <button class="compile-button" type="button" @click="runCompiler">Compile template</button>

      <div class="output-grid">
        <article><span class="section-label">2 · AST</span><pre><code>{{ ast }}</code></pre></article>
        <article><span class="section-label">3 · Render code</span><pre><code>{{ code }}</code></pre></article>
      </div>

      <p class="guide">Complete compiler.ts, then use malformed tags too. The public tests cover parsing boundaries, nesting, errors, transforms, and multiple roots.</p>
    </section>
  </main>
</template>

<style scoped>
.compiler-lab { display: grid; gap: 1.5rem; width: min(100% - 2rem, 58rem); margin: min(8vh, 3.5rem) auto; color: var(--foreground); }
.page-heading, .status-row > div, .source-panel, .output-grid article, .context-block { display: grid; gap: 0.35rem; }
.page-heading h1, .page-heading p, .guide { margin: 0; }
.page-heading p, .guide, .section-label { color: var(--muted-foreground); }
.eyebrow, .section-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.lab-card { display: grid; gap: 1.15rem; padding: 1.25rem; color: var(--card-foreground); background: var(--card); border: 1px solid var(--border); border-radius: var(--preview-card-radius); }
.status-row { display: flex; gap: 0.75rem; align-items: center; justify-content: space-between; }
.status-badge { flex: none; padding: 0.35rem 0.6rem; color: var(--muted-foreground); font-size: 0.75rem; font-weight: 700; background: var(--muted); border-radius: var(--preview-control-radius); }
.status-badge.connected { color: var(--primary-foreground); background: var(--primary); }
.status-badge.failed { color: var(--destructive-foreground, var(--foreground)); background: var(--destructive, var(--muted)); }
.context-block summary { width: fit-content; cursor: pointer; }
.context-block pre, .output-grid pre { padding: 0.9rem; margin: 0; overflow: auto; color: var(--foreground); line-height: 1.55; background: var(--background); border: 1px solid var(--border); border-radius: var(--preview-control-radius); }
.context-block pre { max-height: 15rem; }
.sample-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.sample-row button, .compile-button { padding: 0.55rem 0.8rem; font: inherit; font-weight: 600; border-radius: var(--preview-control-radius); cursor: pointer; }
.sample-row button { color: var(--foreground); background: var(--background); border: 1px solid var(--border); }
.compile-button { width: fit-content; color: var(--primary-foreground); background: var(--primary); border: 1px solid var(--primary); }
.source-panel textarea { width: 100%; padding: 0.85rem; color: var(--foreground); font: 0.9rem/1.5 ui-monospace, monospace; resize: vertical; background: var(--background); border: 1px solid var(--border); border-radius: var(--preview-control-radius); }
.output-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
.output-grid article { min-width: 0; }
.output-grid pre { min-height: 14rem; max-height: 22rem; white-space: pre-wrap; }
.guide { line-height: 1.6; }
@media (min-width: 46.01rem) { .output-grid pre { height: min(42vh, 22rem); min-height: 0; max-height: none; white-space: pre; } }
@media (max-width: 46rem) { .output-grid { grid-template-columns: 1fr; } }
@media (max-width: 38rem) { .status-row { align-items: flex-start; } .compile-button { width: 100%; } }
</style>
