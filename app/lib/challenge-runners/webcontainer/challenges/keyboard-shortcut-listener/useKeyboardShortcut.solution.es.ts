import { onMounted, onUnmounted } from "vue";

export function useKeyboardShortcut(onShortcut: () => void) {
  function handleKeydown(event: KeyboardEvent) {
    const matchesShortcut = event.ctrlKey && event.altKey && event.key.toLowerCase() === "m";

    if (matchesShortcut) {
      onShortcut();
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}
