import { ref } from "vue";

export function useDisclosure(initialValue: boolean = false) {
  const isOpen = ref(initialValue);

  function open() {
    // TODO: abre el panel.
  }

  function close() {
    // TODO: cierra el panel.
  }

  function toggle() {
    // TODO: alterna el estado actual.
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
