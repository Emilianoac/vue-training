import { randomTipService } from "@/services/api/random-tip/randomTipService";
import type { RandomTip } from "@/types/random-tip";

export default function useRandomTipData() {
  const { locale } = useI18n();
  
  const randomTips = ref<RandomTip[]>([]);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({ 
    status: false, 
    message: "" 
  });

  async function getRandomTips() {
    await loadAndSet(() => randomTipService.fetchRandomTips(`/api/random-tip/all?locale=${locale.value}`), randomTips)
  }

  async function loadAndSet<T>(fetchFn: () => Promise<T>, targetRef: Ref<T>) {
    isLoading.value = true;
    error.value.status = false;
    error.value.message = "";

    try {
      const data = await fetchFn();
      targetRef.value = data;
    } catch (err) {
      error.value.status = true;
      error.value.message = err instanceof Error ? err.message : "Unkown error"
    } finally {
      isLoading.value = false;
    }
  }

  return {
    randomTips,
    isLoading,
    error,

    getRandomTips
  };
}