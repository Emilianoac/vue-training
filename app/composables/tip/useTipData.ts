import type { Tip } from "@/schemas/tip.schema";
import { tipService } from "@/services/api/tip/tipService";

export default function useTipData() {
  const { locale } = useI18n();

  const tips = ref<Tip[]>([]);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({
    status: false,
    message: "",
  });

  async function getTips() {
    await loadAndSet(() => tipService.fetchTips(locale.value), tips);
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
      error.value.message = err instanceof Error ? err.message : "Unkown error";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    tips,
    isLoading,
    error,

    getTips,
  };
}
