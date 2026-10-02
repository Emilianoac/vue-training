<script setup lang="ts">
import useQuizCharacterSound from "@/composables/quiz/useQuizCharacterSound";

const props = defineProps<{
  html: string;
  startDelay?: number;
}>();

const emit = defineEmits<{
  completed: [];
}>();

const { playCharacterSound } = useQuizCharacterSound();
const animatedElement = ref<HTMLElement | null>(null);
const isAnimationReady = ref(false);

let animationRun = 0;
let animationTimer: ReturnType<typeof setTimeout> | undefined;
let hasCompleted = false;

function clearAnimationTimer() {
  if (animationTimer === undefined) return;

  clearTimeout(animationTimer);
  animationTimer = undefined;
}

function getCharacterDelay(character: string) {
  if (/[.!?…]/.test(character)) return 90;
  if (/[,;:]/.test(character)) return 55;
  return 20;
}

function markAsCompleted() {
  if (hasCompleted) return;

  hasCompleted = true;
  emit("completed");
}

function complete() {
  animationRun += 1;
  clearAnimationTimer();

  if (animatedElement.value) {
    animatedElement.value.innerHTML = props.html;
  }

  isAnimationReady.value = true;
  markAsCompleted();
}

async function animate() {
  const currentRun = ++animationRun;
  clearAnimationTimer();
  hasCompleted = false;
  isAnimationReady.value = false;

  await nextTick();

  if (currentRun !== animationRun) return;

  const root = animatedElement.value;
  if (!root) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    complete();
    return;
  }

  if (props.startDelay) {
    await new Promise<void>((resolve) => {
      animationTimer = setTimeout(() => {
        animationTimer = undefined;
        resolve();
      }, props.startDelay);
    });

    if (currentRun !== animationRun) return;
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
    if (!segment) {
      markAsCompleted();
      return;
    }

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
  () => props.html,
  () => {
    void animate();
  },
  { flush: "sync" },
);

onMounted(() => {
  void animate();
});

onBeforeUnmount(() => {
  animationRun += 1;
  clearAnimationTimer();
});

defineExpose({ complete });
</script>

<template>
  <div class="grid">
    <div class="invisible col-start-1 row-start-1" aria-hidden="true" v-html="html"></div>
    <div
      ref="animatedElement"
      class="col-start-1 row-start-1"
      :class="isAnimationReady ? 'visible' : 'invisible'"
      aria-hidden="true"
      v-html="html"
    ></div>
    <div class="sr-only" v-html="html"></div>
  </div>
</template>
