<script lang="ts" setup>
import useMarkdownParser from "@/composables/useMarkdownParser";
import useQuizCharacterSound from "@/composables/quiz/useQuizCharacterSound";

const { parse } = useMarkdownParser();
const { playCharacterSound } = useQuizCharacterSound();

const props = defineProps<{
  text: string;
}>();

const parsedQuestion = computed(() => parse(props.text));
const animatedQuestionElement = ref<HTMLElement | null>(null);
const isAnimationReady = ref(false);

let animationRun = 0;
let animationTimer: ReturnType<typeof setTimeout> | undefined;

function clearAnimationTimer() {
  if (animationTimer === undefined) return;

  clearTimeout(animationTimer);
  animationTimer = undefined;
}

function getCharacterDelay(character: string) {
  if (/[.!?]/.test(character)) return 90;
  if (/[,;:]/.test(character)) return 55;
  return 20;
}

async function animateQuestion() {
  const currentRun = ++animationRun;
  clearAnimationTimer();
  isAnimationReady.value = false;

  await nextTick();

  if (currentRun !== animationRun) return;

  const root = animatedQuestionElement.value;
  if (!root) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    isAnimationReady.value = true;
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const segments: Array<{ node: Text; characters: string[] }> = [];
  let textNode = walker.nextNode();

  while (textNode) {
    const node = textNode as Text;
    segments.push({ node, characters: Array.from(node.data) });
    node.data = "";
    textNode = walker.nextNode();
  }

  isAnimationReady.value = true;

  let segmentIndex = 0;
  let characterIndex = 0;
  let audibleCharacterIndex = 0;

  function revealNextCharacter() {
    if (currentRun !== animationRun) return;

    const segment = segments[segmentIndex];
    if (!segment) return;

    const character = segment.characters[characterIndex];

    if (character === undefined) {
      segmentIndex += 1;
      characterIndex = 0;
      revealNextCharacter();
      return;
    }

    segment.node.data += character;
    characterIndex += 1;

    if (/\S/.test(character)) {
      playCharacterSound(audibleCharacterIndex);
      audibleCharacterIndex += 1;
    }

    animationTimer = setTimeout(revealNextCharacter, getCharacterDelay(character));
  }

  revealNextCharacter();
}

watch(
  () => props.text,
  () => {
    void animateQuestion();
  },
  { flush: "sync" },
);

onMounted(() => {
  void animateQuestion();
});

onBeforeUnmount(() => {
  animationRun += 1;
  clearAnimationTimer();
});
</script>

<template>
  <div class="overflow-hidden rounded-lg border bg-zinc-950 shadow-lg shadow-black/20">
    <div class="flex items-center gap-2 border-b bg-card px-3 py-2 font-mono">
      <div class="flex gap-1.5" aria-hidden="true">
        <span class="size-2.5 rounded-full bg-red-400"></span>
        <span class="size-2.5 rounded-full bg-amber-300"></span>
        <span class="size-2.5 rounded-full bg-emerald-400"></span>
      </div>
      <span class="ml-2 text-xs text-zinc-400">vue-training:~/quiz</span>
    </div>

    <div class="flex min-h-24 items-start gap-3 px-5 py-4 font-mono text-zinc-100">
      <span class="shrink-0 text-emerald-400 text-3xl animate-pulse" aria-hidden="true"> ❯ </span>

      <div class="block font-semibold md:flex md:items-center md:text-[1.3rem]">
        <div class="grid flex-1">
          <div
            class="invisible col-start-1 row-start-1"
            aria-hidden="true"
            v-html="parsedQuestion"
          ></div>
          <div
            ref="animatedQuestionElement"
            class="col-start-1 row-start-1"
            :class="isAnimationReady ? 'visible' : 'invisible'"
            aria-hidden="true"
            v-html="parsedQuestion"
          ></div>
          <div class="sr-only" v-html="parsedQuestion"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
