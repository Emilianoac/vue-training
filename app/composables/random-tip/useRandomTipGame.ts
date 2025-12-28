import type { RandomTip } from "@/types/random-tip";

export default function useRandomTipGame(randomTips: RandomTip[]) {

  const currentRandomTip = ref<RandomTip | null>(randomTips[0] ? randomTips[0] : null);
  const error = reactive({
    status: false,
    message: ""
  })

  function applyTip(tip: RandomTip | null) {
    if (!currentRandomTip) {
      error.status = true;
      return;
    }
    currentRandomTip.value = tip;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getRandomTip() {
    let newTip = currentRandomTip.value;

    do {
      newTip = randomTips[Math.floor(Math.random() * randomTips.length)] ?? null
    } while (newTip?.documentId === currentRandomTip.value?.documentId);

    applyTip(newTip);
  }

  function selectTip(tip: RandomTip) {
    applyTip(tip);
  } 

  return {
    currentRandomTip,
    randomTips,
    getRandomTip,
    selectTip
  };
}
