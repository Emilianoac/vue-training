import type { Ref } from "vue";
import type { RandomTip } from "@/types/random-tip";

export default function useRandomTipGame(randomTips: Ref<RandomTip[]>) {

  const currentTipId = ref<string | null>(null);

  const currentRandomTip = computed<RandomTip | null>(() => {
    if (!currentTipId.value) return null;
    return (
      randomTips.value.find( tip => tip.documentId === currentTipId.value ) ?? null
    );
  });

  function applyTip(tip: RandomTip | null) {
    currentTipId.value = tip?.documentId ?? null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getRandomTip() {
    if (!randomTips.value.length) return;

    let newTipId: string;

    do {
      const random = randomTips.value[Math.floor(Math.random() * randomTips.value.length)]!;      
      newTipId = random.documentId;
    } while (newTipId === currentTipId.value && randomTips.value.length > 1);

    currentTipId.value = newTipId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectTip(tip: RandomTip) {
    applyTip(tip);
  }

  watch(
    randomTips,
    (tips) => {
      if (!tips.length) {
        currentTipId.value = null;
        return;
      }

      if (
        !currentTipId.value || !tips.some(t => t.documentId === currentTipId.value)
      ) {
        currentTipId.value = tips[0]?.documentId ? tips[0]?.documentId: null;
      }
    },
    { immediate: true }
  );
  
  return {
    currentRandomTip,
    currentTipId,
    randomTips,
    getRandomTip,
    selectTip
  };
}
