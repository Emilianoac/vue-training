import { onMounted, onUnmounted } from "vue";

export function useKeyboardShortcut(onShortcut: () => void) {
  function handleKeydown(event: KeyboardEvent) {
    const matchesShortcut = event.ctrlKey && event.altKey && event.key.toLowerCase() === "m";

    if (matchesShortcut) {
      onShortcut();
    }
  }

  // TODO: registra handleKeydown en window cuando el consumidor se monte.

  // TODO: elimina el mismo listener cuando el consumidor se desmonte.
}
