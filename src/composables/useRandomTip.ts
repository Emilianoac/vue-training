// composables/useRandomTip.ts
import { ref, watchEffect } from "vue";
import { marked } from "marked";
import { useGeneralStore } from "@/stores/general";
import randomTips from "@/data/random-tips";
import type { RandomTip } from "@/types/random-tip";

export function useRandomTip() {
  const store = useGeneralStore();
  const randomTip = ref<RandomTip>(randomTips[Math.floor(Math.random() * randomTips.length)]);
  const markdownToHtml = ref(marked(randomTip.value.text[store.locale]));

  function applyTip(tip: RandomTip) {
    randomTip.value = tip;
    markdownToHtml.value = marked(tip.text[store.locale]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getRandomTip() {
    let newTip = randomTip.value;
    while (newTip.id === randomTip.value.id) {
      newTip = randomTips[Math.floor(Math.random() * randomTips.length)];
    }
    applyTip(newTip);
  }

  function selectTip(tip: RandomTip) {
    applyTip(tip);
  }

  watchEffect(() => {
    markdownToHtml.value = marked(randomTip.value.text[store.locale]);
  });

  return {
    randomTip,
    randomTips,
    markdownToHtml,
    getRandomTip,
    selectTip
  };
}
