import { ref } from "vue";

export function useDisclosure(initialValue: boolean = false) {
  const isOpen = ref(initialValue);

  function open() {
    // TODO: open the panel.
  }

  function close() {
    // TODO: close the panel.
  }

  function toggle() {
    // TODO: toggle the current state.
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
