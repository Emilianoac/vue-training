<script setup lang="ts">
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

const props = defineProps<{
  output: string;
}>();

const { t } = useI18n();

const terminalRoot = ref<HTMLElement | null>(null);
let terminal: Terminal | null = null;
let fitAddon: FitAddon | null = null;
let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;

onMounted(() => {
  if (!terminalRoot.value) return;

  terminal = new Terminal({
    convertEol: true,
    cursorBlink: false,
    disableStdin: true,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 12,
    lineHeight: 1.35,
    theme: getTerminalTheme(),
  });

  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(terminalRoot.value);
  terminal.write(props.output);

  requestAnimationFrame(() => fitAddon?.fit());

  resizeObserver = new ResizeObserver(() => {
    fitAddon?.fit();
  });
  resizeObserver.observe(terminalRoot.value);

  themeObserver = new MutationObserver(updateTerminalTheme);
  themeObserver.observe(document.documentElement, {
    attributeFilter: ["class", "data-theme", "style"],
    attributes: true,
  });
});

watch(
  () => props.output,
  (output) => {
    if (!terminal) return;
    terminal.clear();
    terminal.write(output);
  },
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  terminal?.dispose();
  resizeObserver = null;
  themeObserver = null;
  fitAddon = null;
  terminal = null;
});

function updateTerminalTheme() {
  if (!terminal) return;

  requestAnimationFrame(() => {
    if (!terminal) return;
    terminal.options.theme = getTerminalTheme();
  });
}

function getTerminalTheme() {
  return {
    background: readThemeColor("--editor-terminal-background"),
    foreground: readThemeColor("--editor-terminal-foreground"),
    cursor: readThemeColor("--editor-terminal-cursor"),
    black: readThemeColor("--editor-terminal-background"),
    blue: readThemeColor("--editor-terminal-blue"),
    cyan: readThemeColor("--editor-terminal-cyan"),
    green: readThemeColor("--editor-terminal-green"),
    magenta: readThemeColor("--editor-terminal-magenta"),
    red: readThemeColor("--editor-terminal-red"),
    white: readThemeColor("--editor-terminal-foreground"),
    yellow: readThemeColor("--editor-terminal-yellow"),
  };
}

function readThemeColor(token: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}
</script>

<template>
  <div class="flex h-full flex-col gap-4 bg-(--editor-terminal-background)">
    <div class="flex w-full bg-(--editor-panel-surface-background) p-2">
      <span class="w-fit border-b border-(--editor-panel-tab-accent) pb-1 font-mono text-xs">
        {{ t("challenge.runner.terminal.title") }}
      </span>
    </div>
    <div ref="terminalRoot" class="min-h-0 flex-1 overflow-hidden px-2 pb-2" />
  </div>
</template>
