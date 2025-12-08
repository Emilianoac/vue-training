import { ref } from "vue";

interface TopLoader {
  loading: typeof loading;
  progress: typeof progress;
  start: () => void;
  finish: () => void;
}

const loading = ref(false);
const progress = ref(0);
let interval: ReturnType<typeof setInterval> | null = null;

export function useTopLoader(): TopLoader {
  function start(): void {
    loading.value = true;
    progress.value = 0;

    interval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 10;
      }
    }, 200);
  }

  function finish(): void {
    progress.value = 100;
    setTimeout(() => {
      loading.value = false;
      progress.value = 0;
      if (interval) clearInterval(interval);
    }, 300);
  }

  return { loading, progress, start, finish };
}
